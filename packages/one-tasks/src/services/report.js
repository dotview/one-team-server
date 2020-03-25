import {user as UserModel, report as ReportModel} from 'one-models'
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
    async findNoReportsUsers(isLastWeek) {
        let users = await UserModel.find({'teamId': '5aa5e5a44dcaed6feadbae19', 'white': false}, 'nickName eMail').exec()
        // 获取起止时间
        let beginDate = serviceUtil.getFirstDayOfWeek()
        if (isLastWeek) {
            beginDate = serviceUtil.getDayOfWeek(beginDate, -7)
        }
        let endDate = serviceUtil.getLastDayOfWeek(beginDate)

        let fiterRule = {'beginDate': { $gte: beginDate, $lte: endDate }, 'type': 'weekly'}

        // 获取列表
        let weeklyList = await ReportModel
            .find(fiterRule)
            .populate('userId', 'nickName eMail')
            .exec()
        // console.log('weeklyList--------', weeklyList)

        let filterUsers = users.filter((user) => {
            return !userHasReport(weeklyList, user)
        })
        // console.log('filterUsers--------', filterUsers)

        return filterUsers
    }
}
