import jwt from 'jsonwebtoken'

// 工具库
import { validatorUtil, serviceUtil } from 'one-util'
import * as Enum from '../constants/enum'

// 数据库
import {user as UserModel} from 'one-models'

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

class Application {
    /**
     * @Author   dongyusi
     * @DateTime 2018-03-26
     * @des      signIn [登陆操作]
     * @param    {String}  eMail  [邮箱]
     * @param    {String}  userPassword   [密码]
     * @return   {String}  token  [身份令牌]
     */
    async signIn(ctx, next) {
        let formData = ctx.request.body
        let result = serviceUtil.initRes()
        try {
            // 校验
            let errMsg = checkFormData(formData)
            if (errMsg) {
                serviceUtil.sendErrMsg(ctx, errMsg)
                return
            }

            // 查询
            let user = await UserModel.findOne({
                'eMail': formData.eMail
            }).exec()

            if (user) {
                // let password = serviceUtil.encrypt(formData.userPassword)
                if (user.userPassword === formData.userPassword) {
                    result.success = true

                    let userToken = {
                        id: user._id,
                        exp: Date.now() + 60 * 60 * 1000
                    }
                    result.result.token = jwt.sign(userToken, Enum.secret)

                    ctx.cookies.set('name', new Buffer(user.nickName).toString('base64'), { httpOnly: false })
                    ctx.cookies.set('team', user.teamId, { httpOnly: false })
                } else {
                    result.error = '用户密码错误'
                }
            } else {
                result.error = '用户名不存在'
            }
            ctx.response.body = result
        } catch (err) {
            serviceUtil.sendErrMsg(ctx, err.message)
        }
    }

    /**
     * @Author   dongyusi
     * @DateTime 2018-03-26
     * @des      signOut  [退出操作]
     * @return   {Boolean}  success  [操作结果]
     */
    async signOut(ctx, next) {
        try {
            ctx.set(
                'Set-Cookie', ['name=', 'team=']
            )
            ctx.response.body = {
                success: true
            }
        } catch (err) {
            serviceUtil.sendErrMsg(ctx, err.message)
        }
    }
}

export default new Application()
