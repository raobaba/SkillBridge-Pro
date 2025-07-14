/**
 * ---------------------------------
 * File: dumpData.utils.js
 * Description:
 * This file contains functionality for processing and populating the database with data 
 * from a CSV file ("View Cadre Report.csv"). The process involves reading the CSV file, 
 * parsing its content into JSON, grouping the data, and then inserting it into the relevant 
 * database tables (Unit, Department, Sub Department, Designation). 
 * 
 * Steps:
 * 1. Parse the CSV file into a JSON object.
 * 2. Group the data by Unit, Department, Sub Department, and Designation.
 * 3. Insert records into the respective tables:
 *    - Unit (with a simple name).
 *    - Department (linked to a default unit_id).
 *    - Designation (linked to a default unit_id).
 *    - Sub Department (linked to Department by name).
 * 
 * Assumptions:
 * - Related database models (unit, department, subDepartment, designation) support bulkCreate.
 * - The `unit_id` field is set to a default value of 1.
 * 
 * Author: Rameshware Marbate
 * Created On: May-07-2025
 * Updated On: May-07-2025
 * 
 * Notes:
 * - Ensure that the CSV file path is correct and accessible.
 * - The related database tables are assumed to exist with the necessary foreign key constraints.
 * ---------------------------------
 */



const path = require("path");
const csv = require("csvtojson");
const { groupBy, } = require("lodash");

/**
 * Reads and processes a CSV file ("View Cadre Report.csv") to populate related tables in the database.
 * 
 * Steps:
 * 1. Parses CSV data into JSON format.
 * 2. Groups the data by Unit, Department, Sub Department, and Designation.
 * 3. Prepares data and inserts records into:
 *    - Unit
 *    - Department (with default unit_id)
 *    - Designation (with default unit_id)
 *    - Sub Department (linked to department by name)
 * 
 * Assumes:
 * - The related database models (`unit`, `department`, `designation`, `subDepartment`) exist and support bulkCreate.
 * - unit_id is set to a default value of 1 for simplicity.
 */
async function initiateDataCreation(db) {
  try {

    const filePath = path.resolve(process.cwd(), "src", "utils", "View Cadre Report.csv");
    const data = await csv().fromFile(filePath);
    const units = groupBy(data, "Unit");
    const departments = groupBy(data, "Department");
    const subDepartments = groupBy(data, "Sub Department");
    const designation = groupBy(data, "Designation");
    // await db.department.drop();
    // await db.unit.drop();
    // await db.subDepartment.drop();
    // await db.designation.drop();
    const unitsData = []
    for (const key in units) {
      unitsData.push({ name: key })
    }
    await db.unit.bulkCreate(unitsData);
    const departmentData = []
    for (const key in departments) {
      departmentData.push({ name: key, unit_id: 1 })
    }
    await db.department.bulkCreate(departmentData);
    const designationData = []
    for (const key in designation) {
      designationData.push({ name: key, unit_id: 1 })
    }
    await db.designation.bulkCreate(designationData);
    const subDepartmentData = []
    for (const key in subDepartments) {
      if (key !== '-') {
        const subDept = subDepartments[key][0]
        const dept = await db.department.findOne({ where: { name: subDept.Department } })
        subDepartmentData.push({ name: key, unit_id: 1, department_id: dept.id })
      }
    }
    await db.subDepartment.bulkCreate(subDepartmentData);
    console.log(subDepartmentData);
  } catch (e) {
    console.log(e.message);
  }
}
module.exports = { initiateDataCreation };