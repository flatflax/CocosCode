// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;
import Blob from './blob'

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Node)
    blob: cc.Node = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchBegan, this);
    }

    onTouchBegan(event){
        var touchLoc = event.touch.getLocation();

        var node = cc.instantiate(this.blob);
        var blob = node.getComponent(Blob);
        blob.init();
        blob.emitTo(touchLoc);

        node.active = true;
        node.parent = cc.director.getScene();
    }

    // start () {}

    // update (dt) {}
}
