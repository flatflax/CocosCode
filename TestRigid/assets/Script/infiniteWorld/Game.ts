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
export default class Game extends cc.Component {

    @property(cc.Node)
    private ball: cc.Node = null;

    @property(cc.Node)
    private barBg: cc.Node = null;

    @property(cc.Node)
    private progressBar: cc.Node = null;

    @property(cc.Node)
    private UI: cc.Node = null;

    private position: cc.Vec2;
    private progressFlags: boolean;
    private maxX: number;
    private originalX: number;


    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        // cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
        this.originalX = this.UI.x;
        this.maxX = 0;
    }

    onKeyDown(event) {
        this.progressFlags = true;
        // this.progressUpdate(300, null);
    }

    _progressUpdate(range: number) {
        if (!this.ball) {
            return
        }

        let speed = 20;
        var width = this.progressBar.width;
        width = width < range ? width += speed : 0;
        this.progressBar.width = width;
    }

    _potisionUpdate(){
        let positionLabel = this.UI.getChildByName('position');
        positionLabel.getComponent(cc.Label).string = 'Max position:' + Math.floor(this.maxX/10)/10;
    }

    clickButton() {
        this.ball.getComponent(cc.RigidBody).type = 2;
    }

    speedUpdate() {
        let body = this.ball.getComponent(cc.RigidBody);
        body.linearVelocity.x += 10000;
        body.linearVelocity.y += 8000;
        body.angularVelocity += 10000;
    }

    start() {
    }

    update(dt) {
        let targetPos = this.ball.convertToWorldSpaceAR(cc.Vec2.ZERO);
        this.position = this.UI.parent.convertToNodeSpaceAR(targetPos);
        if (this.ball.getComponent(cc.RigidBody).type == 2) {
            this.UI.x = this.position.x - 480;
            this.UI.y = this.position.y - 340;
        }

        let progressVerge = this.barBg.width;
        if (this.progressFlags) {
            this._progressUpdate(progressVerge);
            this.progressFlags = false;
        }

        if (this.progressBar.width == progressVerge) {
            this.speedUpdate();
            this._progressUpdate(progressVerge);
        }

        this.maxX = this.UI.x - this.originalX;
        this._potisionUpdate();

    }
}
