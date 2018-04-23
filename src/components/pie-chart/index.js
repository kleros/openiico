import React from 'react'
import PropTypes from 'prop-types'
import ReactMinimalPieChart from 'react-minimal-pie-chart'

import './pie-chart.css'

const PieChart = ({ slice, total, size }) => (
  <ReactMinimalPieChart
    data={
      total
        ? [
            {
              value: slice,
              key: 1,
              color: '#47525d'
            },
            { value: total - slice, key: 2, color: '#f2f5fa' }
          ]
        : [{ value: 1, key: 1, color: '#f2f5fa' }]
    }
    startAngle={270}
    animate
    className="PieChart"
    style={{ height: size, width: size }}
  />
)

PieChart.propTypes = {
  // State
  slice: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  size: PropTypes.number.isRequired
}

export default PieChart
