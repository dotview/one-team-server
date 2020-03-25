import jwt from 'jsonwebtoken'

// 工具库
import {
    validatorUtil,
    serviceUtil
} from 'one-util'
import * as Enum from '../constants/enum'
import businessUtil from '../util/business'

// 数据库
import {
    team as TeamModel,
    msgbox as MsgboxModel,
    user as UserModel
} from 'one-models'
import {
    agenda,
    TaskEnum
} from 'one-tasks'

// 下面这个校验函数，对字段的校验顺序就是代码的顺序，固定死了。可以寻求校验顺序按照我传入的字段顺序
function checkFormData(formData) {
    if ('eMail' in formData && !validatorUtil.checkEmail(formData.eMail)) {
        return formData.eMail ? '邮箱格式错误' : '请填写邮箱'
    }
    if ('nickName' in formData && !validatorUtil.checkNickName(formData.nickName)) {
        return '请输入2-12位中文，字母，数字，下划线组合昵称'
    }
    // if ('userPassword' in formData && !validatorUtil.checkPwd(formData.userPassword)) {
    //     return '请输入6-12位字母数字符号组合密码'
    // }
    if ('confirmPassword' in formData && formData.userPassword !== formData.confirmPassword) {
        return formData.confirmPassword ? '两次输入密码不一致' : '请再次输入密码'
    }
    if ('phoneNumber' in formData && !validatorUtil.checkPhoneNum(formData.phoneNumber)) {
        return formData.phoneNumber ? '手机号码格式错误' : '请输入手机号码'
    }
    if ('teamName' in formData && !validatorUtil.checkTeamName(formData.teamName)) {
        return formData.teamName ? '请输入2-12位中文，字母，数字，下划线组合团队名称' : '请输入团队名称'
    }
}
// function checkFormData(formData) {
//     const empty = {
//         eMail: '请填写邮箱',
//         nickName: '请输入2-12位中文，字母，数字，下划线组合昵称',
//         phoneNumber: '请输入手机号码',
//         teamName: '请输入团队名称'
//     }
//     const errorFormat = {
//         eMail: '邮箱格式错误',
//         nickName: '请输入2-12位中文，字母，数字，下划线组合昵称',
//         phoneNumber: '手机号码格式错误',
//         teamName: '请输入2-12位中文，字母，数字，下划线组合团队名称'
//     }
//     const checkMap = {
//         eMail: val => {
//             return validatorUtil.checkEmail(val)
//         },
//         nickName: val => {
//             return validatorUtil.checkNickName(val)
//         },
//         phoneNumber: val => {
//             return validatorUtil.phoneNumber(val)
//         },
//         teamName: val => {
//             return validatorUtil.teamName(val)
//         }
//     }
//     for (let key in formData) {
//         if (key === 'userPassword' || key === 'confirmPassword') {
//             continue
//         }
//         if (!formData[key]) {
//             return typeof empty[key] === undefined
//                 ? `缺少对${key}的校验`
//                 : empty[key]
//         } else {
//             let fn = checkMap[key]
//             if (typeof fn !== 'function') {
//                 return `缺少对${key}的校验`
//             } else {
//                 if (!checkMap[key](formData[key])) return errorFormat[key]
//             }
//         }
//     }
//     if (formData.userPassword !== formData.confirmPassword) {
//         return '两次输入密码不一致'
//     }
// }

function createSixNum() {
    let num = ''
    for (let i = 0; i < 6; i++) {
        num += Math.floor(Math.random() * 10)
    }
    return num
}

class User {
    /**
     * @Author   dongyusi
     * @DateTime 2018-03-27
     * @des      [新增用户]
     * @param    {String}   eMail  [邮箱]
     * @param    {String}   nickName  [用户昵称]
     * @param    {String}   userPassword  [密码]
     * @param    {String}   confirmPassword  [密码确认]
     * @param    {String}   teamName  [团队名称]
     * @param    {String}   teamId  [团队id]
     * @return   {String}  token  [身份令牌]
     */
    async add(ctx, next) {
        let formData = ctx.request.body
        let result = serviceUtil.initRes()
        let teamId = formData.teamId

        // 校验数据格式
        let errMsg = checkFormData(formData)
        if (errMsg) {
            serviceUtil.sendErrMsg(ctx, errMsg)
            return
        }
        // 用户是否已存在
        let user = await UserModel.findOne({
            eMail: formData.eMail
        }).exec()

        if (!user) {
            // 团队
            if (formData.teamName) {
                let team = new TeamModel({
                    teamName: formData.teamName,
                    createTime: new Date()
                })
                let teamSave = await team.save()
                teamId = teamSave.id
            }
            if (formData.teamId) {
                let team = await TeamModel.findOne({
                    _id: formData.teamId
                }).exec()
                if (!team) {
                    serviceUtil.sendErrMsg(ctx, '团队邀请码错误')
                    return
                }
            }
            // 新增用户
            let userReg = new UserModel({
                eMail: formData.eMail,
                nickName: formData.nickName,
                userPassword: formData.userPassword,
                teamId: teamId // 团队id
            })

            // todo: strange code style? by lm 2018/08/16
            let userRegRes = await userReg.save()
            let userToken = {
                id: userRegRes._id
            }
            result.result.token = jwt.sign(userToken, Enum.secret)
            ctx.cookies.set(
                'name',
                new Buffer(userRegRes.nickName).toString('base64'),
                { httpOnly: false }
            )
            ctx.cookies.set('team', userRegRes.teamId, { httpOnly: false })
            let url = `http://${ctx.request.header.host}/page/user/center`
            // send email
            agenda.now(TaskEnum.SENDEMAIL, {
                to: userRegRes.eMail,
                subject: '欢迎使用Onteam',
                content: `Hi ${userRegRes.nickName}, 欢迎使用Onteam,<h3>
                <a href="${url}">${url}</a></h3>`
            })

            // 加入团队
            let oldTeamValue = {
                _id: teamId
            }
            let newTeamData = {
                $push: {
                    memberList: userRegRes.id
                }
            }
            if (formData.teamName) {
                Object.assign(newTeamData, {
                    $set: {
                        administrator: userRegRes.id
                    }
                })
            }
            await TeamModel.update(oldTeamValue, newTeamData)
            result.success = true
            ctx.response.body = result
        } else {
            result.error = '该邮箱已被注册'
            result.success = false
            ctx.response.body = result
        }
    }

    /**
     * @Author   dongyusi
     * @DateTime 2018-04-02
     * @param    {String} userId  [用户id]
     * @des      [获取用户信息]
     * @return   {String}  token  [身份令牌]
     */
    async getInfo(ctx, next) {
        let formData = ctx.request.query
        let userId = formData.userId || businessUtil.getStatus(ctx)
        let host = ctx.request.headers.host
        let msgboxCount = await MsgboxModel.find({
            userId,
            isRead: false
        }).countDocuments()
        let user = await UserModel.findById(userId)
            .lean(true) // ???
            .exec()
        user.isHost = userId === businessUtil.getStatus(ctx)
        // Object.assign(user, { msgboxCount: msgboxCount })
        // user.msgboxCount = msgboxCount
        // let userObj = Object.assign({}, { msgboxCount }, user)
        user.msgboxCount = msgboxCount
        let result = {
            result: user,
            test: '123',
            success: true
        }
        ctx.response.body = result
    }

    /**
     * @Author   dongyusi
     * @DateTime 2018-04-02
     * @des      [修改用户信息]
     * @param    {String}   eMail  [邮箱]
     * @param    {String}   nickName  [用户昵称]
     * @param    {String}   phoneNumber  [手机号码]
     * @param    {String}   oldPassword  [密码]
     * @param    {String}   userPassword  [新密码]
     * @param    {String}   confirmPassword  [密码确认]
     * @return   {Boolean}   success  [操作结果]
     */
    async update(ctx, next) {
        let userId = businessUtil.getStatus(ctx)
        let formData = ctx.request.body
        let errMsg = checkFormData(formData)
        if (errMsg) {
            serviceUtil.sendErrMsg(ctx, errMsg)
            return
        }

        if (formData.oldPassword) {
            let user = await UserModel.findOne({
                _id: userId
            }).exec()
            if (user.userPassword !== formData.oldPassword) {
                serviceUtil.sendErrMsg(ctx, '密码错误')
                return
            }
        }
        let updateDate = {}
        let requires = [
            'headPortrait',
            'eMail',
            'nickName',
            'phoneNumber',
            'userPassword'
        ]
        for (let item of requires) {
            if (formData[item]) {
                Object.assign(updateDate, {
                    [item]: formData[item]
                })
            }
        }

        await UserModel.update(
            {
                _id: userId
            },
            {
                $set: updateDate
            }
        )
        let result = {
            result: updateDate,
            success: true
        }
        ctx.response.body = result
    }

    // 暂时没用
    async updateHead(userId, file) {
        await UserModel.update(
            {
                _id: userId
            },
            {
                $set: { headPortrait: file }
            }
        )
    }

    /**
     * @Author   dongyusi
     * @DateTime 2018-04-02
     * @des      [删除用户]
     * @param    {String}   userId  [用户id]
     */
    async delete(ctx, next) {
        let userId = businessUtil.getStatus(ctx)
        await UserModel.remove({
            '_id': userId
        })
    }
    /**
     * @Author   wusong
     * @DateTime 2018-11-28
     * @des      [发送邮箱验证码]
     * @param    {String}   email  [注册邮箱]
     */
    async emailCode(ctx, next) {
        let formData = ctx.request.body
        let eMail = formData.email
        let result = serviceUtil.initRes()
        // 判断用户是否存在
        let user = await UserModel.findOne({
            'eMail': eMail
        }).exec()
        if (!user) {
            result.error = '该邮箱没有被注册'
            result.success = false
        } else {
            let code = createSixNum()
            let date = new Date()
            let json = {
                emailCode: code,
                emailCodeCreateTime: date
            }
            await UserModel.update({ eMail: eMail }, json)
            result.result = {
                msg: '验证码已发送'
            }
            result.success = true
            agenda.now(TaskEnum.SENDEMAIL, {
                to: eMail,
                subject: 'one team 邮箱验证码',
                content: '您的邮箱验证码是:' + code
            })
        }
        ctx.response.body = result
    }
    /**
     * @Author   wusong
     * @DateTime 2018-11-28
     * @des      [校验邮箱验证码]
     * @param    {String}   email  [注册邮箱]
     * @param    {String}   code  [邮箱验证码]
     * @return   {String}   id  [邮箱验证码校验通过的签名]
     */
    async verifyEmailCode(ctx, next) {
        let formData = ctx.request.query
        let result = serviceUtil.initRes()
        let [email, code] = [formData.email, formData.code]
        let user = await UserModel.findOne({
            'eMail': email
        })
        if (!user) {
            result.error = '邮箱不正确'
        } else {
            if (user.emailCode === Number(code)) {
                let token = {
                    id: user._id
                }
                result.result.id = jwt.sign(token, Enum.secret)
                result.success = true
            } else {
                result.error = '验证码不正确'
            }
        }
        ctx.response.body = result
    }
    /**
     * @Author   wusong
     * @DateTime 2018-11-28
     * @des      [设置新密码]
     * @param    {String}   id  [签名]
     * @param    {String}   pwd  [密码]
     * @return   {String}  token []
     */
    async setPassPwd(ctx, next) {
        let formData = ctx.request.body
        let jwtData = jwt.verify(formData.id, Enum.secret)
        console.log('这是jwtData', jwtData)
        let result = serviceUtil.initRes()
        let [id, pwd] = [jwtData.id, formData.pwd]
        let token = {
            id: id,
            exp: Date.now() + 60 * 60 * 1000
        }
        result.result.token = jwt.sign(token, Enum.secret)
        await UserModel.update({ _id: id }, { userPassword: pwd })
        result.success = true
        ctx.response.body = result
    }
}

export default new User()
