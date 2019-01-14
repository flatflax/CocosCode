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
export default class InfiniteWorld extends cc.Component {

    @property(cc.Node)
    private target: cc.Node = null;

    @property()
    private pixelStep: number = 10;

    @property()
    private xOffset: number = 0;

    @property()
    private yOffset: number = 240;

    @property(cc.SpriteFrame)
    private worldFrame: cc.SpriteFrame = null;

    private hills: any;
    private polls: any;

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.hills = [];
        this.polls = [];

        while (this.xOffset < 1200) {
            this.generateHill();
        }
    }

    generateHillPiece(xOffset: number, points: cc.Vec2[]) {
        let hills = this.hills;
        let first = hills[0];

        if (first && ((this.target.x - first.node.x) > 1000)) {
            first.node.x = xOffset;
            first.collider.points = points;
            first.collider.apply();
            hills.push(hills.shift());
            return
        }

        // 创建新片段
        // 添加刚体，碰撞组件
        let node = new cc.Node();
        node.x = xOffset;
        // node.addComponent(cc.Sprite);
        // node.getComponent(cc.Sprite).spriteFrame = this.worldFrame;
        // node.width = points[2].x;
        // node.height = points[1].y;

        let body = node.addComponent(cc.RigidBody);
        body.type = cc.RigidBodyType.Static;

        let collider = node.addComponent(cc.PhysicsPolygonCollider);
        collider.points = points;
        collider.friction = 0.5;

        node.parent = this.node;
        hills.push({ node: node, collider: collider });
    }

    generateHill() {
        let pixelStep = this.pixelStep;
        let xOffset = this.xOffset;
        let yOffset = this.yOffset;

        let hillWidth = 120 + Math.ceil(Math.random() * 26) * 20;
        let numberOfSlices = hillWidth / pixelStep;

        let j: number;

        // first step
        // 生成上坡
        let randomHeight;
        if (xOffset === 0) {
            randomHeight = 0;
        }
        else {
            randomHeight = Math.min(Math.random() * hillWidth / 7.5, 600 - yOffset); // make sure yOffset < 600
        }

        yOffset += randomHeight;

        for (j = 0; j < numberOfSlices / 2; j++) {
            // polygonCollier points
            let points = [];
            points.push(cc.v2(0, 0));
            points.push(cc.v2(0, yOffset - randomHeight * Math.cos(2 * Math.PI / numberOfSlices * j)));
            points.push(cc.v2(pixelStep, yOffset - randomHeight * Math.cos(2 * Math.PI / numberOfSlices * (j + 1))));
            points.push(cc.v2(pixelStep, 0));

            this.generateHillPiece(xOffset + j * pixelStep, points);
        }

        yOffset += randomHeight;

        // second step
        // 生成下坡
        if (xOffset === 0) {
            randomHeight = 0;
        }
        else {
            randomHeight = Math.min(Math.random() * hillWidth / 5, yOffset - 240); // make sure yOffset > 240
        }

        yOffset -= randomHeight;

        for (j = numberOfSlices / 2; j < numberOfSlices; j++) {
            // polygonCollier points
            let points = [];
            points.push(cc.v2(0, 0));
            points.push(cc.v2(0, yOffset - randomHeight * Math.cos(2 * Math.PI / numberOfSlices * j)));
            points.push(cc.v2(pixelStep, yOffset - randomHeight * Math.cos(2 * Math.PI / numberOfSlices * (j + 1))));
            points.push(cc.v2(pixelStep, 0));

            this.generateHillPiece(xOffset + j * pixelStep, points);
        }
        yOffset -= randomHeight;

        this.xOffset += hillWidth;
        this.yOffset = yOffset;
    }
    start() {

    }

    update(dt: number) {
        if (!this.target) {
            return
        }
        while ((this.target.x + 1200) > this.xOffset) {
            this.generateHill();
        }
    }
}
