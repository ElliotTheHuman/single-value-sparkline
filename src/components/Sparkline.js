import React from 'react'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import styled from 'styled-components'


const Container = styled.div`
`;

export default class Sparkline extends React.Component {
  constructor (props) {
    super(props)
    this.options = {
      chart: {
        align: 'center',
        backgroundColor: null,
        borderWidth: 0,
        type: 'area',
        margin: [2, 0, 2, 0],
        width: 100,
        height: 100,
        style: {
          overflow: 'visible',
        },
        skipClone: true
      },
      title: {
        text: ''
      },
      credits: {
        enabled: false
      },
      xAxis: {
        labels: {
          enabled: false
        },
        title: {
          text: null
        },
        startOnTick: false,
        endOnTick: false,
        tickPositions: []
      },
      yAxis: {
        endOnTick: false,
        startOnTick: false,
        labels: {
          enabled: false
        },
        title: {
          text: null
        },
        tickPositions: [0]
      },
      legend: {
        enabled: false
      },
      tooltip: {
        enabled: false
      },
      plotOptions: {
        series: {
          animation: false,
          lineWidth: 1,
          shadow: false,
          states: {
            hover: {
              enabled: false
            }
          },
          marker: {
            radius: 1,
            states: {
              hover: {
                radius: 2
              }
            }
          },
          fillOpacity: 0.25
        },
        column: {
          negativeColor: '#910000',
          borderColor: 'silver'
        }
      },
      series: [{
        data: null,
      }],
       loading: false
      }
  }

  static average (array) {
   return array.reduce((a, b) => a + b) / array.length
  }

  render() {
    const options = { ...this.options }
    const compress = parseInt(this.props.config.data_granularity)
    if (compress && compress > 1) {
      const compressedData = []
      let bucket = []
      for (let datum of this.props.data) {
        bucket.push(datum)
        if (bucket.length === compress) {
          compressedData.push(Sparkline.average(bucket))
          bucket = []
        }
      }
      options.series[0].data = compressedData
    } else {
      options.series[0].data = this.props.data
    }
    options.plotOptions.series.color = this.props.config.sparkline_color ? this.props.config.sparkline_color[0] : null
    options.chart.width = this.props.config.width
    options.chart.height = this.props.config.height

    return (
      <Container>
        <HighchartsReact
          highcharts={Highcharts}
          options={options}
        />
      </Container>
    )
  }
}
