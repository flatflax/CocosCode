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
const MOVE_LEFT = 1;
const MOVE_RIGHT = 2;

@ccclass
export default class BallControl extends cc.Component {

    @property()
    private maxSpeed: number = 1200;

    private body: cc.RigidBody;
    private moveFlags: cc.Flags;
    private firstCollider: boolean;

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);

        this.firstCollider = true;

        // var canvas = cc.find('/Canvas');
        // canvas.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        // canvas.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
    }

    onBeginContact(contact, selfCollider, otherCollider) {
        if (!this.body) {
            return
        }
        if (this.firstCollider) {
            this.body.linearVelocity.x += 10000;
            this.body.angularVelocity += this.maxSpeed * 2;
            this.firstCollider = false;
        }
    }

    start() {
        this.body = this.getComponent(cc.RigidBody);
    }

    onKeyDown(event) {
        switch (event.keyCode) {
            case cc.macro.KEY.a:
            case cc.macro.KEY.left:
                this.moveFlags |= MOVE_LEFT;
                this.updateMotorSpeed();
                break;
            case cc.macro.KEY.d:
            case cc.macro.KEY.right:
                this.moveFlags |= MOVE_RIGHT;
                this.updateMotorSpeed();
        }
    }

    onKeyUp(event) {
        switch (event.keyCode) {
            case cc.macro.KEY.a:
            case cc.macro.KEY.left:
                this.moveFlags &= ~MOVE_LEFT;
                this.updateMotorSpeed();
                break;
            case cc.macro.KEY.d:
            case cc.macro.KEY.right:
                this.moveFlags &= ~MOVE_RIGHT;
                this.updateMotorSpeed();
        }
    }

    onTouchStart(event) {
        let touchLoc = event.touch.getLocation();
        if (touchLoc.x < cc.winSize.width / 2) {
            this.moveFlags |= MOVE_LEFT;
        }
        else {
            this.moveFlags |= MOVE_RIGHT;
        }
        this.updateMotorSpeed();
    }

    onTouchEnd(event) {
        let touchLoc = event.touch.getLocation();
        if (touchLoc.x < cc.winSize.width / 2) {
            this.moveFlags &= ~MOVE_LEFT;
        }
        else {
            this.moveFlags &= ~MOVE_RIGHT;
        }
        this.updateMotorSpeed();
    }

    updateMotorSpeed() {
        if (!this.body) {
            return
        }
        var desiredSpeed = 0;
        if ((this.moveFlags & MOVE_LEFT) == MOVE_LEFT) {
            desiredSpeed = -this.maxSpeed;
        }
        else if ((this.moveFlags & MOVE_RIGHT) == MOVE_RIGHT) {
            desiredSpeed = this.maxSpeed;
        }
        this.body.angularVelocity = desiredSpeed;

    }

    update(dt: number) {
        if (this.moveFlags) {
            this.updateMotorSpeed();
        }
    }
}
