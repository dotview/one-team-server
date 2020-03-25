/*
 * @Description: okrs
 * @Author: 沈浩
 */
// 工具库
import businessUtil from '../util/business'
// 数据库
import {
    okrs as OkrsModel
} from 'one-models'

/**
 * 类：okr列表
 * @public
 */
class Okrs {
    /**
     * @Author   沈浩
     * @des      [新建帖子]
     * @param    {String}   userId  [用户id]
     * @param    {String}   _id  [okrid]
     * @param    {String}   category  [类型]
     * @param    {String}   group  [分组]
     * @param    {String}   year  [年份]
     * @param    {String}   quarter  [季度]
     * @param    {String}   title  [标题]
     * @param    {String}   describe  [描述]
     **/
    async save(ctx, next) {
        let formData = ctx.request.body

        let { category, group, year, quarter, title, describe, theme, state, member } = formData

        let userId = businessUtil.getStatus(ctx)

        let createOkr = new OkrsModel({
            creater: userId,
            category,
            group,
            year,
            quarter,
            title,
            describe,
            theme,
            member
        })

        let ret = await createOkr.save()

        ctx.res.success({
            okrId: ret._id
        }, '操作成功！')
    }

    async getList(ctx, next) {
        let formData = ctx.request.query

        let { category, group, year, quarter } = formData
        let filterRule = {}

        if (category !== '0') {
            filterRule.category = category
        }
        if (group !== '0') {
            filterRule.group = group
        }
        if (year !== '0') {
            filterRule.year = year
        }
        if (quarter !== '0') {
            filterRule.quarter = quarter
        }
        let list = await OkrsModel.find(filterRule, '_id creater theme title describe')
                .sort({ _id: 1 })
                .populate('creater', '_id headPortrait nickName')

        let result = {
            result: {
                list
            },
            success: true
        }

        ctx.response.body = result
    }

    async getDetail(ctx, next) {
        let formData = ctx.request.query

        let { okrId } = formData

        let filterRule = {
            _id: okrId
        }

        let detail = await OkrsModel.findOne(filterRule, '_id creater theme member title describe boards')
                .populate('creater', '_id headPortrait nickName')
                .populate('member', '_id headPortrait nickName')

        let result = {
            result: {
                detail
            },
            success: true
        }

        ctx.response.body = result
    }

    async delete(ctx, next) {
        let okrId = ctx.request.query.id || ctx.request.body.id

        await OkrsModel.deleteOne({ _id: okrId })

        ctx.res.success()
    }

    async update(ctx, next) {
        let formData = ctx.request.body

        let { _id, theme, title, describe, boards, member } = formData

        await OkrsModel.updateOne({ _id: _id }, { $set: { theme, title, describe, boards, member } })

        ctx.res.success({
            okrId: _id
        }, '操作成功！')
    }
}

export default new Okrs()
