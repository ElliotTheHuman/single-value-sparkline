import React from 'react'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import styled from 'styled-components'


const Container = styled.div`
`;


/* Define the Sparkline class
  - Constructor
  - average function
  - render function
*/
export default class Sparkline extends React.Component {
  constructor (props) {
    super(props)

    // Feed the highchart chart options here
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

  // Average Function
  static average (array) {
   return array.reduce((a, b) => a + b) / array.length
  }


  // Render Function
  render() {

    // Assign options variable to the Sparkline object's options
    const options = { ...this.options }

    // Assign compress variable to this props-config-data_granuality. 
    // The this.props.config.data_granuality piece is probably coming from the JSON blob inserted into looker.plugins.visualizations.add(...) in single_value_sparkline.js
    const compress = parseInt(this.props.config.data_granularity) 


    // If compress is non-null and is greater than 1, then squish it down based on the compression value
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
    } 
    // Otherwise, don't do anything to the data, just give me every element in the array possible
    else {
      options.series[0].data = this.props.data
    }

    // assign the color to be the user inputted color; otherwise do nothing and use the default
    options.plotOptions.series.color = this.props.config.sparkline_color ? this.props.config.sparkline_color[0] : null

    // Use the width and height that the user gives, or use default
    options.chart.width = this.props.config.sparkline_width
    options.chart.height = this.props.config.sparkline_height

    // Elliot Note: Let's try giving the user an option to choose either "column" or "area"
    options.chart.type = this.props.config.chart_type

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
