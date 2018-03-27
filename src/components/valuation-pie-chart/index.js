import React from 'react'
import PropTypes from 'prop-types'
import PieChart from 'react-minimal-pie-chart'

const ValuationPieChart = ({ committed, total, size }) => (
  <PieChart
    data={[
      {
        value: committed,
        key: 1,
        color: '#47525d'
      },
      { value: total - committed, key: 2, color: '#f2f5fa' }
    ]}
    startAngle={270}
    style={{ height: size, width: size }}
    animate
  />
)

ValuationPieChart.propTypes = {
  // State
  committed: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  size: PropTypes.number.isRequired
}

export default ValuationPieChart
