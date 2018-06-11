import Sequelize = require('sequelize'); 

export function create_triggers(models: any){
	models.sequelize.query(
        'DROP TRIGGER IF EXISTS aggregate_hourly;'
    );
    models.sequelize.query(
        ' CREATE TRIGGER aggregate_hourly AFTER INSERT ON rawData' +
        ' FOR EACH ROW' +
        ' BEGIN' +
            ' DELETE FROM hourlyData' +
            ' WHERE year = new.year AND month = new.month AND day = new.day AND hour = new.hour AND sensorId = new.sensorId AND sensorGroupId = new.sensorGroupId AND basestationId = new.basestationId;' +

            ' INSERT INTO hourlyData (id, value, year, month, day, hour, createdAt, updatedAt, sensorId, sensorGroupId, basestationId)' + 
            ' SELECT NULL as id, avg(value) as value, year, month, day, hour, NOW() as createdAt, NOW() as updatedAt, sensorId, sensorGroupId, basestationId' +
            ' FROM rawData' +
            ' WHERE year = new.year AND month = new.month AND day = new.day AND hour = new.hour AND sensorId = new.sensorId AND sensorGroupId = new.sensorGroupId AND basestationId = new.basestationId' +
            ' GROUP BY year, month, day, hour, sensorId, sensorGroupId, basestationId;' + 
        ' END;'
    );
    models.sequelize.query(
        'DROP TRIGGER IF EXISTS aggregate_daily;'
    );
    models.sequelize.query(
        ' CREATE TRIGGER aggregate_daily AFTER INSERT ON hourlyData' +
        ' FOR EACH ROW' +
        ' BEGIN' +
            ' DELETE FROM dailyData' +
            ' WHERE year = new.year AND month = new.month AND day = new.day AND sensorId = new.sensorId AND sensorGroupId = new.sensorGroupId AND basestationId = new.basestationId;' +

            ' INSERT INTO dailyData (id, value, year, month, day, createdAt, updatedAt, sensorId, sensorGroupId, basestationId)' + 
            ' SELECT NULL as id, avg(value) as value, year, month, day, NOW() as createdAt, NOW() as updatedAt, sensorId, sensorGroupId, basestationId' +
            ' FROM hourlyData' +
            ' WHERE year = new.year AND month = new.month AND day = new.day AND sensorId = new.sensorId AND sensorGroupId = new.sensorGroupId AND basestationId = new.basestationId' +
            ' GROUP BY year, month, day, sensorId, sensorGroupId, basestationId;' + 
        ' END;'
    );
    models.sequelize.query(
        'DROP TRIGGER IF EXISTS aggregate_monthly;'
    );
    models.sequelize.query(
        ' CREATE TRIGGER aggregate_monthly AFTER INSERT ON dailyData' +
        ' FOR EACH ROW' +
        ' BEGIN' +
            ' DELETE FROM monthlyData' +
            ' WHERE year = new.year AND month = new.month AND sensorId = new.sensorId AND sensorGroupId = new.sensorGroupId AND basestationId = new.basestationId;' +

            ' INSERT INTO monthlyData (id, value, year, month, createdAt, updatedAt, sensorId, sensorGroupId, basestationId)' + 
            ' SELECT NULL as id, avg(value) as value, year, month, NOW() as createdAt, NOW() as updatedAt, sensorId, sensorGroupId, basestationId' +
            ' FROM dailyData' +
            ' WHERE year = new.year AND month = new.month AND sensorId = new.sensorId AND sensorGroupId = new.sensorGroupId AND basestationId = new.basestationId' +
            ' GROUP BY year, month, sensorId, sensorGroupId, basestationId;' + 
        ' END;'
    );
    models.sequelize.query(
        'DROP TRIGGER IF EXISTS aggregate_yearly;'
    );
    models.sequelize.query(
        ' CREATE TRIGGER aggregate_yearly AFTER INSERT ON monthlyData' +
        ' FOR EACH ROW' +
        ' BEGIN' +
            ' DELETE FROM yearlyData' +
            ' WHERE year = new.year AND sensorId = new.sensorId AND sensorGroupId = new.sensorGroupId AND basestationId = new.basestationId;' +

            ' INSERT INTO yearlyData (id, value, year, createdAt, updatedAt, sensorId, sensorGroupId, basestationId)' + 
            ' SELECT NULL as id, avg(value) as value, year, NOW() as createdAt, NOW() as updatedAt, sensorId, sensorGroupId, basestationId' +
            ' FROM monthlyData' +
            ' WHERE year = new.year AND sensorId = new.sensorId AND sensorGroupId = new.sensorGroupId AND basestationId = new.basestationId' +
            ' GROUP BY year, sensorId, sensorGroupId, basestationId;' + 
        ' END;'
    );
}