import Agenda from 'agenda'
import user from '../jobs/user'
import weeklyreport from '../jobs/weeklyreport'
import forum from '../jobs/weeklyforum'

const mongoConnectionString = process.env.NODE_ENV === 'production' ? process.env['DB_URL_JOB'] : 'mongodb://192.168.4.28:27017/agendatest'

const agenda = new Agenda({ db: { address: mongoConnectionString } })

// 引入jobs
weeklyreport(agenda)
user(agenda)
forum(agenda)

export default agenda
