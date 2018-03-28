import React from 'react'
import PropTypes from 'prop-types'
import ReactMinimalPieChart from 'react-minimal-pie-chart'

const PieChart = ({ slice, total, size }) => (
  <ReactMinimalPieChart
    data={[
      {
        value: slice,
        key: 1,
        color: '#47525d'
      },
      { value: total - slice, key: 2, color: '#f2f5fa' }
    ]}
    startAngle={270}
    style={{ height: size, width: size }}
    animate
  />
)

PieChart.propTypes = {
  // State
  slice: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  size: PropTypes.number.isRequired
}

export default PieChart
