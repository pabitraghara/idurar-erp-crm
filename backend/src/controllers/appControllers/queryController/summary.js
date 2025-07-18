const mongoose = require('mongoose');
const moment = require('moment');

const summary = async (Model, req, res) => {
  let defaultType = 'month';
  const { type } = req.query;

  if (type && ['week', 'month', 'year'].includes(type)) {
    defaultType = type;
  } else if (type) {
    return res.status(400).json({
      success: false,
      result: null,
      message: 'Invalid type',
    });
  }

  const currentDate = moment();
  let startDate = currentDate.clone().startOf(defaultType);
  let endDate = currentDate.clone().endOf(defaultType);

  const pipeline = [
    {
      $facet: {
        totalQueries: [
          {
            $match: {
              removed: false,
              enabled: true,
            },
          },
          {
            $count: 'count',
          },
        ],
        newQueries: [
          {
            $match: {
              removed: false,
              created: { $gte: startDate.toDate(), $lte: endDate.toDate() },
              enabled: true,
            },
          },
          {
            $count: 'count',
          },
        ],
        queriesByStatus: [
          {
            $match: {
              removed: false,
              enabled: true,
            },
          },
          {
            $group: {
              _id: '$status',
              count: { $sum: 1 },
            },
          },
        ],
        queriesByPriority: [
          {
            $match: {
              removed: false,
              enabled: true,
            },
          },
          {
            $group: {
              _id: '$priority',
              count: { $sum: 1 },
            },
          },
        ],
      },
    },
  ];

  const aggregationResult = await Model.aggregate(pipeline);

  const result = aggregationResult[0];
  const totalQueries = result.totalQueries[0] ? result.totalQueries[0].count : 0;
  const totalNewQueries = result.newQueries[0] ? result.newQueries[0].count : 0;

  // Process status counts
  const statusCounts = {};
  result.queriesByStatus.forEach((item) => {
    statusCounts[item._id] = item.count;
  });

  // Process priority counts
  const priorityCounts = {};
  result.queriesByPriority.forEach((item) => {
    priorityCounts[item._id] = item.count;
  });

  const totalNewQueriesPercentage = totalQueries > 0 ? (totalNewQueries / totalQueries) * 100 : 0;

  return res.status(200).json({
    success: true,
    result: {
      total: totalQueries,
      new: totalNewQueries,
      newPercentage: Math.round(totalNewQueriesPercentage),
      byStatus: {
        Open: statusCounts['Open'] || 0,
        InProgress: statusCounts['InProgress'] || 0,
        Closed: statusCounts['Closed'] || 0,
      },
      byPriority: {
        Low: priorityCounts['Low'] || 0,
        Medium: priorityCounts['Medium'] || 0,
        High: priorityCounts['High'] || 0,
        Critical: priorityCounts['Critical'] || 0,
      },
    },
    message: 'Successfully get summary of queries',
  });
};

module.exports = summary;
