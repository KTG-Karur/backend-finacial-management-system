"use strict";

const sequelize = require('../models/index').sequelize;
const messages = require("../helpers/message");
const _ = require('lodash');
const { QueryTypes } = require('sequelize');
const { getEmployee } = require('./employee-service');

async function getEmployeeAttendance(query) {
    try {
        let iql = "";
        let count = 0;
        if (query && Object.keys(query).length) {
            iql += `WHERE `;
            if (query.employeeId) {
                iql += count >= 1 ? ` AND` : ``;
                count++;
                iql += ` e.employee_id = ${query.employeeId}`;
            }
            if (query.attendanceDate) {
                iql += count >= 1 ? ` AND` : ``;
                count++;
                iql += ` DATE(ea.attendance_date)= '${query.attendanceDate}'`;
            }
            if (query.employeeAttendanceId) {
                iql += count >= 1 ? ` AND` : ``;
                count++;
                iql += ` ea.employee_attendance_id = ${query.employeeAttendanceId}`;
            }
        }
        const result = await sequelize.query(`SELECT ea.employee_attendance_id "employeeAttendanceId", ea.attendance_date "attendanceDate", 
            ea.employee_id "employeeId",CONCAT(e.first_name,' ',e.last_name) as employeeName,
            ea.check_in "checkIn", ea.check_out "checkOut",
            ea.attendance_status_id "attendanceStatusId",ea.reason
            FROM employee_attendance ea
            left join employee e on e.employee_id = ea.employee_id  ${iql}`, {
            type: QueryTypes.SELECT,
            raw: true,
            nest: false
        });
        return result;
    } catch (error) {
        console.log(error)
        throw new Error(error.errors[0].message ? error.errors[0].message : messages.OPERATION_ERROR);
    }
}

async function getEmployeeAttendanceReport(query) {
    try {
        let iql = "";
        let count = 0;
        if (query && Object.keys(query).length) {
            iql += `WHERE `;
            if (query.employeeId) {
                iql += count >= 1 ? ` AND` : ``;
                count++;
                iql += ` e.employee_id = ${query.employeeId}`;
            }
            if (query.attendanceDate) {
                iql += count >= 1 ? ` AND` : ``;
                count++;
                iql += ` DATE(ea.attendance_date)= '${query.attendanceDate}'`;
            }
            if (query.fromDate && query.toDate) {
                iql += count >= 1 ? ` AND` : ``;
                count++;
                iql += ` DATE(ea.attendance_date) BETWEEN '${query.fromDate}' AND '${query.toDate}'`;
            }
            if (query.employeeAttendanceId) {
                iql += count >= 1 ? ` AND` : ``;
                count++;
                iql += ` ea.employee_attendance_id = ${query.employeeAttendanceId}`;
            }
        }
        console.log(iql)
        const result = await sequelize.query(`select e.employee_id "employeeId", CONCAT(e.first_name,' ',e.last_name) as employeeName,
            SUM(CASE WHEN ea.attendance_status_id = 1 THEN 1 ELSE 0 END) AS present,
            SUM(CASE WHEN ea.attendance_status_id = 2 THEN 1 ELSE 0 END) AS absent,
            SUM(CASE WHEN ea.attendance_status_id THEN 1 ELSE 0 END) AS totalWorkingDays
            from employee e
            left join employee_attendance ea on ea.employee_id = e.employee_id ${iql}
            GROUP BY e.employee_id `, {
            type: QueryTypes.SELECT,
            raw: true,
            nest: false
        });
        return result;
    } catch (error) {
        console.log(error)
        throw new Error(error.errors[0].message ? error.errors[0].message : messages.OPERATION_ERROR);
    }
}

async function createEmployeeAttendance(postData) {
    try {
        const request = {
            attendanceDate: postData.attendanceDate
        }
        const checkPerviousAttendance = await getEmployeeAttendance(request)
        if (checkPerviousAttendance.length > 0) {
            const employeeAttendanceId = await _.filter(checkPerviousAttendance, function (o) {
                return o.employeeId === postData.employeeId;
            }
            );
            return await updateEmployeeAttendance(employeeAttendanceId[0].employeeAttendanceId, postData)
        } else {
            const request = {
                isActive: 1,
                isUser: 1
            }
            const attendanceEmployeeList = await getEmployee(request)
            let employeeBulkCreate = []
            if (attendanceEmployeeList.length > 0) {
                attendanceEmployeeList.map((itm, idx) => {
                    if (itm.employeeId === postData.employeeId) {
                        employeeBulkCreate.push(postData)
                    } else {
                        const req = {
                            "employeeId": itm.employeeId,
                            "attendanceDate": postData.attendanceDate,
                            "attendanceStatusId": 2,
                        }
                        employeeBulkCreate.push(req)
                    }
                })
                const excuteMethod = _.map(employeeBulkCreate, (item) => _.mapKeys(item, (value, key) => _.snakeCase(key)));
                const employeeAttendanceResult = await sequelize.models.employee_attendance.bulkCreate(excuteMethod);
                const employeeAttendaceReq = {
                    attendanceDate: postData.attendanceDate,
                    employeeId: postData.employeeId
                }
                console.log(employeeAttendaceReq)
                return await getEmployeeAttendance(employeeAttendaceReq)
            } else {
                throw new Error(messages.INVALID_USER);
            }
        }
    } catch (error) {
        console.log(error)
        throw new Error(error.errors[0].message ? error.errors[0].message : messages.OPERATION_ERROR);
    }
}

async function updateEmployeeAttendance(employeeAttendanceId, putData) {
    try {
        const excuteMethod = _.mapKeys(putData, (value, key) => _.snakeCase(key))
        const employeeAttendanceResult = await sequelize.models.employee_attendance.update(excuteMethod, { where: { employee_attendance_id: employeeAttendanceId } });
        const req = {
            employeeAttendanceId: employeeAttendanceId
        }
        return await getEmployeeAttendance(req);
    } catch (error) {
        throw new Error(error.errors[0].message ? error.errors[0].message : messages.OPERATION_ERROR);
    }
}

module.exports = {
    getEmployeeAttendance,
    getEmployeeAttendanceReport,
    updateEmployeeAttendance,
    createEmployeeAttendance
};