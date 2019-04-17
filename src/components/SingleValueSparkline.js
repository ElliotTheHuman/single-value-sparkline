import React from 'react'
import styled from 'styled-components'

import Sparkline from './Sparkline'

const SingleValue = styled.div` 
  font-family: "Open Sans", "Noto Sans JP", Helvetica, Arial, sans-serif;
  font-weight: 100;
  font-size: 72px;
  padding: 10px
`;

const SingleValueSmall = styled.div`
  font-size: 50px;
`

const SingleValueLarge = styled.div`
  font-size: 72px;
`

const TopBottomLayout = styled.div``

const LeftRightLayout = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`

// Takes the Single Value AND the Sparkline object you created, then plops out a layout object
export default class Hello extends React.Component {
  constructor (props) {
    super(props)
  }

  render() {
    if (!this.props.done) {
      return <div>Loading...</div>
    }


    // Grab the first row of data
    let firstRow = this.props.data[0];

    // Set the firstCellValue variable equal to the first measure rendered value
    let firstCellValue = firstRow[this.props.queryResponse.fields.measures[0].name].rendered
    
    // If the first measure.rendered (not sure what this is versus value) is null, then set firstcellValue to be the first measure value instead
    if (!firstCellValue) {
      firstCellValue = firstRow[this.props.queryResponse.fields.measures[0].name].value
    }
    
    // input data array, output a transformed data array
    // grab the first/leftmost measure and grab every value of that measure
    let dataToRender = this.props.data.map(d => {
      return d[this.props.queryResponse.fields.measures[0].name].value
    })

    // Elliot Note: Needed to reverse the dataToRender array since the data was backwards
    dataToRender = dataToRender.reverse()

    // Font size of single value
    const FontSizeWrapper = this.props.config.font_size === 'small' ? SingleValueSmall : SingleValueLarge
    
    // So we create a Sparkline component with these specifications
    const sparkline = (
      <Sparkline
        key="sparkline"
        color={this.props.config.sparkline_color}
        config={this.props.config}
        data={dataToRender}
      />
    )

    const singleValue = (
      <SingleValue key="singleValue">
        <FontSizeWrapper>
          {firstCellValue}
        </FontSizeWrapper>
      </SingleValue>
    )
    let layout = [sparkline, singleValue]


      // HOW DOES THE SMASHING TOGETHER WORK??

    let Container = TopBottomLayout
    switch (this.props.config.chart_alignment) {
      case 'bottom':
        layout.reverse()
        break
      case 'left':
        Container = LeftRightLayout
        break
      case 'right':
        layout.reverse()
        Container = LeftRightLayout
        break
    }

    return (
      <Container>
        {layout}
      </Container>
    )
  }
}
