import Agenda from 'agenda'
import user from '../jobs/user'
import weeklyreport from '../jobs/weeklyreport'
import forum from '../jobs/weeklyforum'

const mongoConnectionString = process.env['DB_URL_JOB']

const agenda = new Agenda({ db: { address: mongoConnectionString } })

// 引入jobs
weeklyreport(agenda)
user(agenda)
forum(agenda)

export default agenda
