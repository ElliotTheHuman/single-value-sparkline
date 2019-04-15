import React from 'react'
import styled from 'styled-components'

import Sparkline from './Sparkline'

const SingleValue = styled.div`
  font-family: "Open Sans", "Noto Sans JP", Helvetica, Arial, sans-serif;
  font-weight: 30;
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

export default class Hello extends React.Component {
  constructor (props) {
    super(props)
  }

  render() {
    if (!this.props.done) {
      return <div>Loading...</div>
    }

    let firstRow = this.props.data[0];
    let firstCellValue = firstRow[this.props.queryResponse.fields.measures[0].name].rendered
    if (!firstCellValue) {
      firstCellValue = firstRow[this.props.queryResponse.fields.measures[0].name].value
    }
    const dataToRender = this.props.data.map(d => {
      return d[this.props.queryResponse.fields.measures[0].name].value
    })

    const FontSizeWrapper = this.props.config.font_size === 'small' ? SingleValueSmall : SingleValueLarge
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
