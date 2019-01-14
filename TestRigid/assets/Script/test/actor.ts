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

    // LIFE-CYCLE CALLBACKS:
    @property()
    private onGround: boolean = false;

    onLoad() {
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
    }

    onBeginContact(contact, selfCollider, otherCollider) {
        if (otherCollider.tag == 0) {
            this.onGround = true;
        }
    }

    onEndContact(contact, selfCollider, otherCollider) {
        if (otherCollider.tag == 0) {
            this.onGround = false;
        }
    }

    onKeyDown(event) {
        let rigidBody = this.node.getComponent(cc.RigidBody);
        let localCenter = rigidBody.getLocalCenter();
        if (this.onGround) {


            switch (event.keyCode) {
                case cc.macro.KEY.a:
                    rigidBody.linearVelocity = cc.v2(-200, 0);
                    break;
                case cc.macro.KEY.d:
                    rigidBody.linearVelocity = cc.v2(200, 0);
                    break;
                case cc.macro.KEY.space:
                    rigidBody.applyLinearImpulse(cc.v2(0, 2000), localCenter, false);
                    break;
            }
        }
    }

    start() {

    }

    // update (dt) {}
}
