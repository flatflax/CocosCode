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
export default class CameraControl extends cc.Component {

    @property(cc.Node)
    private target: cc.Node = null;

    private camera: cc.Camera;

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.camera = this.getComponent(cc.Camera);
    }

    // start () {

    // }

    update(dt): void {
        let rigidType = this.target.getComponent(cc.RigidBody).type;
        if (rigidType == 2) {
            let targetPos = this.target.convertToWorldSpaceAR(cc.Vec2.ZERO);
            this.node.position = this.node.parent.convertToNodeSpaceAR(targetPos);
        }


        // let ratio = targetPos.y / cc.winSize.height;
        // this.camera.zoomRatio = 1 + (0.5 - ratio) * 0.2;
    }
}
