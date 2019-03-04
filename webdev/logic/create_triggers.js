"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function create_triggers(models) {
    models.sequelize.query(' CREATE TRIGGER aggregate_hourly AFTER INSERT ON raw_data' +
        ' FOR EACH ROW' +
        ' BEGIN' +
        ' DELETE FROM hourly_data' +
        ' WHERE year = new.year AND month = new.month AND day = new.day AND hour = new.hour AND sensor_id = new.sensor_id AND group_id = new.group_id AND basestation_id = new.basestation_id;' +
        ' INSERT INTO hourly_data (id, value, year, month, day, hour, createdAt, updatedAt, sensor_id, group_id, basestation_id)' +
        ' SELECT NULL as id, avg(value) as value, year, month, day, hour, MAX(createdAt) as createdAt, MAX(updatedAt) as updatedAt, sensor_id, group_id, basestation_id' +
        ' FROM raw_data' +
        ' WHERE year = new.year AND month = new.month AND day = new.day AND hour = new.hour AND sensor_id = new.sensor_id AND group_id = new.group_id AND basestation_id = new.basestation_id' +
        ' GROUP BY year, month, day, hour, sensor_id, group_id, basestation_id;' +
        ' END;').catch(function (onRejected) {
        console.log('TRIGGER aggregate_hourly ALREADY CREATED');
    });
    models.sequelize.query(' CREATE TRIGGER aggregate_daily AFTER INSERT ON hourly_data' +
        ' FOR EACH ROW' +
        ' BEGIN' +
        ' DELETE FROM daily_data' +
        ' WHERE year = new.year AND month = new.month AND day = new.day AND sensor_id = new.sensor_id AND group_id = new.group_id AND basestation_id = new.basestation_id;' +
        ' INSERT INTO daily_data (id, value, year, month, day, createdAt, updatedAt, sensor_id, group_id, basestation_id)' +
        ' SELECT NULL as id, avg(value) as value, year, month, day, MAX(createdAt) as createdAt, MAX(updatedAt) as updatedAt, sensor_id, group_id, basestation_id' +
        ' FROM hourly_data' +
        ' WHERE year = new.year AND month = new.month AND day = new.day AND sensor_id = new.sensor_id AND group_id = new.group_id AND basestation_id = new.basestation_id' +
        ' GROUP BY year, month, day, sensor_id, group_id, basestation_id;' +
        ' END;').catch(function (onRejected) {
        console.log('TRIGGER aggregate_daily ALREADY CREATED');
    });
    models.sequelize.query(' CREATE TRIGGER aggregate_monthly AFTER INSERT ON daily_data' +
        ' FOR EACH ROW' +
        ' BEGIN' +
        ' DELETE FROM monthly_data' +
        ' WHERE year = new.year AND month = new.month AND sensor_id = new.sensor_id AND group_id = new.group_id AND basestation_id = new.basestation_id;' +
        ' INSERT INTO monthly_data (id, value, year, month, createdAt, updatedAt, sensor_id, group_id, basestation_id)' +
        ' SELECT NULL as id, avg(value) as value, year, month, MAX(createdAt) as createdAt, MAX(updatedAt) as updatedAt, sensor_id, group_id, basestation_id' +
        ' FROM daily_data' +
        ' WHERE year = new.year AND month = new.month AND sensor_id = new.sensor_id AND group_id = new.group_id AND basestation_id = new.basestation_id' +
        ' GROUP BY year, month, sensor_id, group_id, basestation_id;' +
        ' END;').catch(function (onRejected) {
        console.log('TRIGGER aggregate_monthly ALREADY CREATED');
    });
    models.sequelize.query(' CREATE TRIGGER aggregate_yearly AFTER INSERT ON monthly_data' +
        ' FOR EACH ROW' +
        ' BEGIN' +
        ' DELETE FROM yearly_data' +
        ' WHERE year = new.year AND sensor_id = new.sensor_id AND group_id = new.group_id AND basestation_id = new.basestation_id;' +
        ' INSERT INTO yearly_data (id, value, year, createdAt, updatedAt, sensor_id, group_id, basestation_id)' +
        ' SELECT NULL as id, avg(value) as value, year, MAX(createdAt) as createdAt, MAX(updatedAt) as updatedAt, sensor_id, group_id, basestation_id' +
        ' FROM monthly_data' +
        ' WHERE year = new.year AND sensor_id = new.sensor_id AND group_id = new.group_id AND basestation_id = new.basestation_id' +
        ' GROUP BY year, sensor_id, group_id, basestation_id;' +
        ' END;').catch(function (onRejected) {
        console.log('TRIGGER aggregate_yearly ALREADY CREATED');
    });
}
exports.create_triggers = create_triggers;
