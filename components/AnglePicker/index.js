import { Component } from "react";
import styles from './style.module.css'
import PropTypes from 'prop-types'

export default class AnglePicker extends Component {
  state = { isPinching: false };

  componentDidMount() {
    this.x = 0
    this.y = 0

    document.addEventListener("mousemove", this.handleMouseMove)
    document.addEventListener("mouseup", this.handleMouseUp)

    document.addEventListener("touchmove", this.handleMouseMove)
    document.addEventListener("touchend", this.handleMouseUp)
  }

  componentWillUnmount() {
    document.removeEventListener("mousemove", this.handleMouseMove)
    document.removeEventListener("mouseup", this.handleMouseUp)

    document.removeEventListener("touchmove", this.handleMouseMove)
    document.removeEventListener("touchend", this.handleMouseUp)
  }

  handleMouseUp = () => {
    this.setState({ isPinching: false })
  };

  handleMouseDown = (e) => {
    // e.preventDefault()

    let pageX, pageY
    if (e.type === 'touchstart' || e.type === 'touchmove') {
      pageX = e.touches[0].pageX
      pageY = e.touches[0].pageY
    } else {
      pageX = e.pageX
      pageY = e.pageY
    }

    const { left, top, width, height } = this.potar.getBoundingClientRect()

    this.x = pageX - (left + width / 2)
    this.y = (top + height / 2) - pageY

    this.setState({ isPinching: true })
  };

  handleMouseMove = (e) => {
    if (this.state.isPinching) {
      let pageX, pageY
      if (e.type === 'touchstart' || e.type === 'touchmove') {
        pageX = e.touches[0].pageX
        pageY = e.touches[0].pageY
      } else {
        pageX = e.pageX
        pageY = e.pageY
      }

      const { left, top, width, height } = this.potar.getBoundingClientRect()

      const x = pageX - (left + width / 2)
      const y = (top + height / 2) - pageY

      const dx = (x - this.x) / 100
      const dy = (y - this.y) / 100

      this.x = x
      this.y = y

      if (this.props.onChange) {
        let xValue = this.props.value + dx
        let yValue = this.props.value + dy

        if (xValue < 0) {
          xValue = 0
        }

        if (xValue > 1) {
          xValue = 1
        }

        if (yValue < 0) {
          yValue = 0
        }

        if (yValue > 1) {
          yValue = 1
        }

        this.props.onChange(xValue, yValue)
      }
    }
  };

  render() {
    const { radius, border, value } = this.props
    const p = 2 * Math.PI * (radius - border / 2)

    const strokeWidth = border
    const strokeDashoffset = p * (1 - value)
    const strokeDasharray = p

    return (
      <svg
        className={styles.Slider}
        ref={(potar) => this.potar = potar}
        viewBox={`0 0 ${radius * 2} ${radius * 2}`}
        onTouchStart={this.handleMouseDown}
        onMouseDown={this.handleMouseDown}>
        <circle
          className={styles.SliderCircle}
          style={{ strokeWidth }}
          r={radius - border / 2}
          cx={radius}
          cy={radius} />

        <circle
          className={styles.SliderBar}
          style={{
            strokeWidth,
            strokeDashoffset,
            strokeDasharray,
          }}
          r={radius - border / 2}
          cx={radius}
          cy={radius} />
      </svg>
    )
  }
}

AnglePicker.defaultProps = {
  radius: 50,
  border: 10,
  value: .5,
}

AnglePicker.propTypes = {
  onChange: PropTypes.func,
  radius: PropTypes.number,
  border: PropTypes.number,
  value: (props, propName) => {
    const value = parseInt(props[propName])

    if (isNaN(value)) {
      return new Error("The potar value must be a number.")
    }

    if (value < 0 || value > 1) {
      return new Error("The potar value must be between 0 and 1.")
    }
  },
}
