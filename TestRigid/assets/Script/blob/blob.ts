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
import Smooth from './smooth';

@ccclass
export default class Blob extends cc.Component {

    @property
    private particleNumber: number = 12;

    @property
    private particleRadius: number = 30;

    @property
    private sphereSize: number = 12;


    private ctx: cc.Graphics;
    private spheres: cc.RigidBody[];

    // 初始化球体
    // 连接小球体
    init() {
        this.ctx = this.getComponent(cc.Graphics);
        this.ctx.lineWidth = 6;

        let x = this.node.x;
        let y = this.node.y;

        let particleNumber = this.particleNumber;
        let particleRadius = this.particleRadius;
        let sphereSize = this.sphereSize;

        let particleAngle = (2 * Math.PI) / particleNumber;
        let particleDistance = Math.sin(particleAngle) * particleRadius * Math.sin((Math.PI - particleAngle) / 2);

        let spheres = [];
        spheres.push(this._createSphere(0, 0, sphereSize, this.node));

        for (let i = 0; i < particleNumber; i++) {
            let angle = particleAngle * i;
            let posX = particleRadius * Math.cos(angle);
            let posY = particleRadius * Math.sin(angle);
            let sphere = this._createSphere(posX, posY, sphereSize, null);
            spheres.push(sphere);

            let joint = sphere.node.addComponent(cc.DistanceJoint);
            joint.connectedBody = spheres[0];
            joint.distance = particleRadius;
            joint.dampingRatio = 0.5;
            joint.frequency = 4;

            if (i > 0) {
                joint = sphere.node.addComponent(cc.DistanceJoint);
                joint.connectedBody = spheres[spheres.length - 2];
                joint.distance = particleDistance;
                joint.dampingRatio = 1;
                joint.frequency = 0;
            }

            if (i === particleNumber - 1) {
                joint = spheres[1].node.addComponent(cc.DistanceJoint);
                joint.connectedBody = sphere;
                joint.distance = particleDistance;
                joint.dampingRatio = 1;
                joint.frequency = 0;
            }

            sphere.node.parent = this.node;
        }

        this.spheres = spheres;
    }

    // 创建刚体，创建物理碰撞组件
    _createSphere(x, y, r, node) {
        if (!node) {
            node = new cc.Node();
            node.x = x;
            node.y = y;
        }

        let body = node.addComponent(cc.RigidBody);

        let collider = node.addComponent(cc.PhysicsCircleCollider);
        // 碰撞体的密度
        collider.density = 1;
        // 碰撞体的弹性系数
        collider.restitution = 0.4;
        // 碰撞体的摩擦力
        collider.friction = 0.5;
        collider.radius = r;

        return body;
    }

    emitTo(target) {
        let x = target.x;
        let y = target.y;

        let selfX = this.node.x;
        let selfY = this.node.y;

        let distance = Math.sqrt((x - selfX) * (x - selfX) + (y - selfY) * (y - selfY));
        let velocity = cc.v2(x - selfX, y - selfY);
        velocity.normalizeSelf();
        velocity.mulSelf(distance * 2);

        this.spheres.forEach(function (sphere) {
            sphere.linearVelocity = velocity;
        });
    }

    update(dt:number) {
        let ctx = this.ctx;

        let points = this.spheres.map(sphere => {
            return this.expandPosition(sphere.node.position);
        });

        points.shift();

        let smooth = new Smooth();
        let result = smooth.getCubicBezierCurvePath(points);
        let firstControlPoints = result[0];
        let secondControlPoints = result[1];

        let pos = points[0];

        ctx.clear();
        ctx.moveTo(pos.x, pos.y);

        for (let i = 1, len = points.length; i < len; i++) {
            let firstControlPoint = firstControlPoints[i - 1],
                secondControlPoint = secondControlPoints[i - 1];

            ctx.bezierCurveTo(
                firstControlPoint.x, firstControlPoint.y,
                secondControlPoint.x, secondControlPoint.y,
                points[i].x, points[i].y
            );
        }

    }


    expandPosition (pos) {
        return pos.mul(1.3);
    }

        // LIFE-CYCLE CALLBACKS:

        // onLoad () {}


        // update (dt) {}
    }
