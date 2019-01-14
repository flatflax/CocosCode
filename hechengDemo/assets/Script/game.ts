// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Label)
    scoreShowLabel: cc.Label = null;

    @property(cc.Label)
    levelShowLabel: cc.Label = null;

    @property(cc.Node)
    gameView: cc.Node = null;

    @property(cc.Node)
    itemDestroy: cc.Node = null;

    @property()
    row: number = 0;

    @property()
    line: number = 0

    private score: number;
    private level: number;
    private experience: number;

    private touchDown: boolean;
    private target: cc.Node;
    private targetOriginPotision: cc.Vec2;

    private itemPotisionList: cc.Vec2[][];
    private itemExistList: [cc.Node, number][][];
    private itemScale: number;

    private viewInit() {
        // 初始化游戏界面
        // 初始化方块坐标itemPotisionList
        this.itemPotisionList = [];
        this.itemExistList = [];

        let itemX = this.gameView.width / this.line;
        let itemY = this.gameView.height / this.row;
        for (let i = 0; i < this.line; i++) {
            let itemPotisionRow = [];
            let itemExistRow = []
            for (let j = 0; j < this.row; j++) {
                let newX = this.gameView.x - this.gameView.width / 2 + itemX * i;
                let newY = this.gameView.y - this.gameView.height / 2 + itemY * j;
                let itemPotision = new cc.Vec2(newX, newY);
                itemPotisionRow.push(itemPotision);
                itemExistRow.push([null, null]);
            }
            this.itemPotisionList.push(itemPotisionRow);
            this.itemExistList.push(itemExistRow);
        }

        this.itemScale = 0.48;
    }

    private buttonClickGenerate() {
        for (let i = 0; i < this.line; i++) {
            for (let j = this.row - 1; j >= 0; j--) {
                if (!this.itemExistList[i][j][0]) {
                    let itemLevel = this.level < 3 ? 0 : Math.floor(Math.random() * (this.level - 3));
                    let item = this.itemGenerate(i, j, itemLevel);
                    this.itemExistList[i][j] = [item, itemLevel];
                    return 0
                }
            }
        }
    }

    private itemGenerate(line: number, row: number, itemLevel: number) {
        // 点击按键生成新的元素
        let item = new cc.Node();
        let sprite = item.addComponent(cc.Sprite);
        sprite.spriteFrame = new cc.SpriteFrame(cc.url.raw("resources/Texture/fruit/" + itemLevel.toString() + ".png"));
        item.scale = this.itemScale;
        item.anchorX = 0;
        item.anchorY = 0;

        item.parent = this.gameView;
        let itemPotision = this.itemPotisionList[line][row];
        item.position = itemPotision;

        item.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this)
        item.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this)
        item.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this)

        return item
    }

    private onTouchMove(event) {
        // 目标跟随手指移动
        if (this.touchDown) {
            let delta = event.getDelta();

            this.target.x = this.target.x + delta.x;
            this.target.y = this.target.y + delta.y;
        }
    }

    private onTouchStart(event) {
        // 手指点击时确定当前目标，存入this.target
        this.touchDown = true;
        this.target = event.target;
        this.targetOriginPotision = this.target.position;
    }

    private onTouchEnd(event) {
        // 手指松开时，根据目标当前位置判断
        // 1. 在游戏框内，且当前位置所在块没有元素-->目标更新坐标为当前块，更新this.itemExistList
        // 2. 在游戏框内，且当前位置所在块中有同级元素-->销毁当前目标，更新当前块中的元素(升级)，更新this.itemExistList
        // 3. 在游戏框外，且和回收框相交-->回收该元素
        this.touchDown = false;

        let position = this.target.position;
        let originIndex = this._findOriginIndex(this.targetOriginPotision)
        let currentIndex = this._findCurrentIndex(position)

        // 获取当前坐标，和回收键进行判断
        let currentPotision = this.itemDestroy.convertToNodeSpaceAR(event.getLocation());

        if (currentPotision.mag() < 40) {
            // 和回收键重合
            this.target.destroy();
            this.itemExistList[originIndex[0]][originIndex[1]] = [null, null];
            console.log('destroy item.')
            return 0;
        }

        if (currentIndex) {
            if (originIndex[0] == currentIndex[0] && originIndex[1] == currentIndex[1]) {
                // 元素相同，不做处理
                console.log('the same item.')
                this.target.position = this.itemPotisionList[originIndex[0]][originIndex[1]]
            }
            else if (!this.itemExistList[currentIndex[0]][currentIndex[1]][0]) {
                // 新位置无元素
                this.target.position = this.itemPotisionList[currentIndex[0]][currentIndex[1]]

                this.itemExistList[currentIndex[0]][currentIndex[1]] = this.itemExistList[originIndex[0]][originIndex[1]];
                this.itemExistList[originIndex[0]][originIndex[1]] = [null, null];
            }
            else if (this.itemExistList[currentIndex[0]][currentIndex[1]][0]) {
                // 新位置存在元素
                console.log('exist!!!')
                let originalItem = this.itemExistList[originIndex[0]][originIndex[1]][0]
                let currentItem = this.itemExistList[currentIndex[0]][currentIndex[1]][0]

                let originalLevel = this.itemExistList[originIndex[0]][originIndex[1]][1]
                let currentLevel = this.itemExistList[currentIndex[0]][currentIndex[1]][1]
                if (originalLevel == currentLevel) {
                    // 元素一致，升级
                    console.log('the same frame!!!')

                    this._frameUpdate(currentItem, currentLevel)
                    originalItem.destroy()
                    this.itemExistList[currentIndex[0]][currentIndex[1]][1] += 1;
                    this.score += this.itemExistList[currentIndex[0]][currentIndex[1]][1]
                    if (this.level < currentLevel + 1) {
                        this.level += 1;
                    }
                    this.itemExistList[originIndex[0]][originIndex[1]] = [null, null];
                }
                else {
                    // 元素不一致，不更新
                    console.log('not the same frame!!!')
                    this.target.position = this.itemPotisionList[originIndex[0]][originIndex[1]]
                }
            }
            else {
                console.log('unexcepted issue.')
            }
        }
        else {
            // 回收元素
            console.log('find nothing!!!')
            this.target.position = this.itemPotisionList[originIndex[0]][originIndex[1]]
        }
        this.target = null;
    }

    private _findCurrentIndex(position: cc.Vec2) {
        let itemX = this.gameView.width / this.line;
        let itemY = this.gameView.height / this.row;
        for (let i = 0; i < this.line; i++) {
            for (let j = 0; j < this.row; j++) {
                let deltaX = position.x - this.itemPotisionList[i][j].x;
                let deltaY = position.y - this.itemPotisionList[i][j].y;
                if ((deltaX < itemX / 2 && deltaX > -itemX / 2) && (deltaY < itemY / 2 && deltaY > -itemY / 2)) {
                    return [i, j]
                }
            }
        }
        return null
    }

    private _findOriginIndex(position: cc.Vec2) {
        for (let i = 0; i < this.line; i++) {
            for (let j = 0; j < this.row; j++) {
                if (position.x == this.itemPotisionList[i][j].x && position.y == this.itemPotisionList[i][j].y) {
                    return [i, j]
                }
            }
        }
        return null
    }

    private _frameUpdate(item: cc.Node, level: number) {
        let newFrameUrl = cc.url.raw("resources/Texture/fruit/" + (level + 1).toString() + ".png");
        item.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(newFrameUrl);
    }
    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.score = 0;
        this.scoreShowLabel.string = this.score.toString();

        this.level = 0;
        this.levelShowLabel.string = this.level.toString();

        this.experience = 0;

        this.touchDown = false;

        this.viewInit();

        // this.gameView.on(cc.Node.EventType.MOUSE_MOVE, this.onMouseMove, this)
        // this.gameView.on(cc.Node.EventType.MOUSE_DOWN, this.onMouseDown, this)

    }

    start() {

    }

    update(dt) {
        this.scoreShowLabel.string = this.score.toString();
        this.levelShowLabel.string = this.level.toString();
    }
}
