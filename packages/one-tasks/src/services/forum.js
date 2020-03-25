import {user as UserModel, forum as forumModel} from 'one-models'
import { serviceUtil } from 'one-util'

/**
 * check if user write week report
 * @param  {[type]} reports [description]
 * @param  {[type]} user    [description]
 * @return {[type]}         [description]
 */
function userHasReport(reports, user) {
    for (let report of reports) {
        if (report.userId.eMail === user.eMail) {
            return true
        }
    }
    return false
}

export default {
    /**
     * [findUserbyMail description]
     * @param  {[type]} email [description]
     * @return {[type]}       [description]
     */
    async findUserbyMail(email) {
        let user = await UserModel.findOne({
            'eMail': email
        }).exec()
        return user
    },
    /**
     * [findUserById description]
     * @param  {[type]} userId [description]
     * @return {[type]}        [description]
     */
    async findUserById(userId) {
        let user = await UserModel.findOne({
            '_id': userId
        }).exec()
        return user
    },
    /**
     * [findNoReportsUsers description]
     * @return {[type]} [description]
     */
    async findNoForumUsers(isLastWeek) {
        let userfilterRule = {
            teamId: '5aa5e5a44dcaed6feadbae19',
            white: false,
            groupId: { $in: ['5b768c691f53306e958f88a3', '5b768dc41f53306e958f88a8', '5c0a18467932350691640a5e'] }
        }
        let users = await UserModel.find(userfilterRule, 'nickName eMail').exec()
        // 获取起止时间
        let beginDate = serviceUtil.getFirstDayOfWeek()
        let endDate = serviceUtil.getLastDayOfWeek(beginDate)

        let fiterRule = {
            forumPId: null,
            teamId: '5aa5e5a44dcaed6feadbae19',
            beginDate: { $gte: beginDate, $lte: endDate }
        }

        // 获取列表
        let weeklyList = await forumModel
            .find(fiterRule)
            .populate('userId', 'nickName eMail')
            .exec()
        // console.log('weeklyList--------', weeklyList)

        let filterUsers = users.filter((user) => {
            return !userHasReport(weeklyList, user)
        })
        if (process.env.NODE_ENV !== 'production') {
            console.log('filterUsers--------', filterUsers)
        }

        return filterUsers
    }
}
