import React, {PropTypes, Component} from 'react'
import Dygraph from 'shared/components/Dygraph'
import classnames from 'classnames'
import shallowCompare from 'react-addons-shallow-compare'

import timeSeriesToDygraph from 'utils/timeSeriesToDygraph'
import lastValues from 'shared/parsing/lastValues'

import {
  SINGLE_STAT_LINE_COLORS,
  SMALL_CELL_HEIGHT,
} from 'src/shared/graphs/helpers'

const {array, arrayOf, bool, func, number, shape, string} = PropTypes

class LineGraph extends Component {
  constructor(props) {
    super(props)
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }

  componentWillMount() {
    const {data, activeQueryIndex, isInDataExplorer} = this.props
    this._timeSeries = timeSeriesToDygraph(
      data,
      activeQueryIndex,
      isInDataExplorer
    )
  }

  componentWillUpdate(nextProps) {
    const {data, activeQueryIndex} = this.props
    if (
      data !== nextProps.data ||
      activeQueryIndex !== nextProps.activeQueryIndex
    ) {
      this._timeSeries = timeSeriesToDygraph(
        nextProps.data,
        nextProps.activeQueryIndex,
        nextProps.isInDataExplorer
      )
    }
  }

  render() {
    const {
      data,
      axes,
      cell,
      title,
      onZoom,
      queries,
      timeRange,
      cellHeight,
      ruleValues,
      isBarGraph,
      resizeCoords,
      synchronizer,
      isRefreshing,
      isGraphFilled,
      showSingleStat,
      displayOptions,
      underlayCallback,
      overrideLineColors,
      isFetchingInitially,
    } = this.props

    const {labels, timeSeries, dygraphSeries} = this._timeSeries

    // If data for this graph is being fetched for the first time, show a graph-wide spinner.
    if (isFetchingInitially) {
      return <GraphSpinner />
    }

    const options = {
      labels,
      connectSeparatedPoints: true,
      labelsKMB: true,
      axisLineColor: '#383846',
      gridLineColor: '#383846',
      title,
      rightGap: 0,
      yRangePad: 10,
      axisLabelWidth: 60,
      drawAxesAtZero: true,
      underlayCallback,
      ...displayOptions,
    }

    const singleStatOptions = {
      ...options,
      highlightSeriesOpts: {
        strokeWidth: 1.5,
      },
    }

    let roundedValue
    if (showSingleStat) {
      const lastValue = lastValues(data)[1]

      const precision = 100.0
      roundedValue = Math.round(+lastValue * precision) / precision
    }

    const lineColors = showSingleStat
      ? SINGLE_STAT_LINE_COLORS
      : overrideLineColors

    return (
      <div className="dygraph graph--hasYLabel" style={{height: '100%'}}>
        {isRefreshing ? <GraphLoadingDots /> : null}
        <Dygraph
          cell={cell}
          resizeCoords={resizeCoords}
          axes={axes}
          queries={queries}
          containerStyle={{width: '100%', height: '100%'}}
          overrideLineColors={lineColors}
          isGraphFilled={showSingleStat ? false : isGraphFilled}
          isBarGraph={isBarGraph}
          timeSeries={timeSeries}
          labels={labels}
          options={showSingleStat ? singleStatOptions : options}
          dygraphSeries={dygraphSeries}
          ruleValues={ruleValues}
          synchronizer={synchronizer}
          timeRange={timeRange}
          setResolution={this.props.setResolution}
          onZoom={onZoom}
        />
        {showSingleStat
          ? <div className="single-stat single-stat-line">
              <span
                className={classnames('single-stat--value', {
                  'single-stat--small': cellHeight === SMALL_CELL_HEIGHT,
                })}
              >
                <span className="single-stat--shadow">
                  {roundedValue}
                </span>
              </span>
            </div>
          : null}
      </div>
    )
  }
}

const GraphLoadingDots = () =>
  <div className="graph-panel__refreshing">
    <div />
    <div />
    <div />
  </div>

const GraphSpinner = () =>
  <div className="graph-fetching">
    <div className="graph-spinner" />
  </div>

LineGraph.defaultProps = {
  underlayCallback: () => {},
  isGraphFilled: true,
  overrideLineColors: null,
}

LineGraph.propTypes = {
  axes: shape({
    y: shape({
      bounds: array,
      label: string,
    }),
    y2: shape({
      bounds: array,
      label: string,
    }),
  }),
  title: string,
  isFetchingInitially: bool,
  isRefreshing: bool,
  underlayCallback: func,
  isGraphFilled: bool,
  isBarGraph: bool,
  overrideLineColors: array,
  showSingleStat: bool,
  displayOptions: shape({
    stepPlot: bool,
    stackedGraph: bool,
  }),
  activeQueryIndex: number,
  ruleValues: shape({}),
  timeRange: shape({
    lower: string.isRequired,
  }),
  isInDataExplorer: bool,
  synchronizer: func,
  setResolution: func,
  cellHeight: number,
  cell: shape(),
  onZoom: func,
  resizeCoords: shape(),
  queries: arrayOf(shape({}).isRequired).isRequired,
  data: arrayOf(shape({}).isRequired).isRequired,
}

export default LineGraph
