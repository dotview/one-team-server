import * as validatorUtil from '../src/validator'

describe('validator function test', () => {

    test('testing checkTeamName', async () => {
        expect(validatorUtil.checkTeamName('')).toBe(false)
        expect(validatorUtil.checkTeamName('22')).toBe(true)
        expect(validatorUtil.checkTeamName('测试测试测试测试测试测试测试1111111')).toBe(false)
        expect(validatorUtil.checkTeamName('223')).toBe(true)
    })

    test('testing checkEmail', async () => {
        expect(validatorUtil.checkEmail('')).toBe(false)
        expect(validatorUtil.checkEmail('22')).toBe(false)
        expect(validatorUtil.checkEmail('dotv@163com')).toBe(true)
        expect(validatorUtil.checkEmail('dotv@163.com')).toBe(true)
    })

})

