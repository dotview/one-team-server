// 工具库
import businessUtil from '../util/business'
import { serviceUtil } from 'one-util'
// 数据库
import {
    team as teamModel,
    user as UserModel,
    weeklyTemplate as WeeklyTemplateModel,
    summaryTemplate as SummaryTemplateModel
} from 'one-models'

class ReportConfig {
    /**
     * @Author   dongyusi
     * @DateTime 2018-03-28
     * @param    {String}  teamId  [团队ID]
     * @return   {String}  weeklyTemplate  [周报模版]
     * @return   {String}  summaryTemplate  [总结模版]
     */
    async getConfig(ctx, next) {
        let formData = ctx.request.body
        let userId = businessUtil.getStatus(ctx)
        // let teamId = formData.teamId || serviceUtil.getCookie(ctx, 'team')
        let teamId = (await UserModel
            .findOne({_id: userId}, 'teamId')
            .exec()).teamId

        if (!teamId) {
            serviceUtil.sendErrMsg(ctx, '未加入团队')
            return
        }
        let teamInfo = await teamModel
            .findOne({ '_id': teamId })
            // .findOne({ '_id': teamId }, 'weeklyTemplate summaryTemplate')
            // .populate('weeklyTemplate')
            // .populate('summaryTemplate')
            .exec()
        let res = {}
        if (teamInfo.weeklyTemplate) {
            Object.assign(res, { weeklyTemplate: await WeeklyTemplateModel.findOne({'_id': teamInfo.weeklyTemplate}, '_id template') })
        }
        if (teamInfo.summaryTemplate) {
            Object.assign(res, { summaryTemplate: await SummaryTemplateModel.findOne({'_id': teamInfo.summaryTemplate}, '_id template') })
        }
        // 返回数据
        let result = {
            result: res,
            success: true
        }
        ctx.response.body = result
    }

    /**
     * @Author   dongyusi
     * @DateTime 2018-03-28
     * @param    {String}  teamId  [团队ID]
     * @param    {String}  template  [模板详情]
     * @param    {String}  type  [模板类型]
     * @return   {Boolean}  success  [操作状态]
     */
    async saveTemplate(ctx, next) {
        let formData = ctx.request.body
        let type = formData.type
        let userId = businessUtil.getStatus(ctx)
        // let teamId = formData.teamId || serviceUtil.getCookie(ctx, 'team')
        let teamId = (await UserModel
            .findOne({_id: userId}, 'teamId')
            .exec()).teamId

        if (type === 'weekly') {
            if (!formData._id) { // 新增模板
                let template = new WeeklyTemplateModel({
                    template: formData.template
                })
                let templateSave = await template.save()
                let templateId = templateSave._id
                await teamModel.update({ _id: teamId }, { $set: { weeklyTemplate: templateId } })
            } else {
                await WeeklyTemplateModel.update({ _id: formData._id }, { $set: { template: formData.template } })
            }
        }

        if (type === 'summary') {
            if (!formData._id) { // 新增模板
                let template = new SummaryTemplateModel({
                    template: formData.template
                })
                let templateSave = await template.save()
                let templateId = templateSave._id
                await teamModel.update({ _id: teamId }, { $set: { summaryTemplate: templateId } })
            } else {
                await SummaryTemplateModel.update({ _id: formData._id }, { $set: { template: formData.template } })
            }
        }

        // 返回数据
        let result = {
            success: true
        }
        ctx.response.body = result
    }
}

export default new ReportConfig()
