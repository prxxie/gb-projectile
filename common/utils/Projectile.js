export default class Projectile {

  SCREEN_PART = 8

  mobileProps = {
    weight: 0,
    windEffect: 0,
    timing: []
  }

  distance = 0
  angle = 0
  wind = 0
  originWindAngle = 0
  windAngle = 0

  hook = false

  constructor(mobileProps) {

    if (!mobileProps.weight || !mobileProps.windEffect) throw new Error('Invalid mobile properties')

    this.mobileProps = { ...this.mobileProps, ...mobileProps }

  }

  setDistance = (v) => {
    if (v < 0) {
      this.windAngle = this.originWindAngle <= 180 ? 180 - this.originWindAngle : 540 - this.originWindAngle
    }

    this.distance = v;
    return this
  }

  setAngle = (v) => { this.angle = v; return this }

  setWind = (v) => { this.wind = v; return this }

  setWindAngle = (v) => {
    this.originWindAngle = v
    if (this.distance < 0) {
      this.windAngle = this.originWindAngle <= 180 ? 180 - this.originWindAngle : 540 - this.originWindAngle
      return this
    }

    this.windAngle = v;
    return this
  }

  specialWind = () => {
    const { wind } = this
    return (wind === 0 ? 0 : (wind <= 8 ? wind - 1 : (wind < 11 ? wind - 0.5 : (wind < 17 ? wind - 0.3 : (wind == 23 ? 23.3 : (wind == 24 ? 23.7 : (wind == 26 ? 26.5 : wind)))))))
  }

  cosin = () => {
    const { abs, cos } = Math
    const { _radians, wind, windAngle } = this

    return abs(cos(_radians(windAngle)) * wind) < 1 ? 0 : _radians(windAngle)
  }

  calculatePower = () => {
    const { sqrt: SQRT, sin: SIN, cos: COS, abs } = Math
    const { weight, windEffect } = this.mobileProps
    const { specialWind, cosin, _radianAngle, distance, SCREEN_PART } = this

    return SQRT((weight - windEffect * specialWind() * SIN(cosin())) / (SIN(2 * _radianAngle()) + 2 * windEffect * specialWind() * COS(cosin()) * SIN(_radianAngle()) * SIN(_radianAngle()) / (weight - windEffect * specialWind() * SIN(cosin())))) * SQRT(abs(distance) / SCREEN_PART)
  }

  autoCalculate = () => {
    const output = [];
    const mobileTiming = [...this.mobileProps.timing]
    for (let i = 0; i <= 90; i++) {
      const simulator = this
      simulator.setAngle(i)
      const power = simulator.calculatePower().toFixed(2)
      const timing = simulator.timing().toFixed(2)

      if (output.length > 0 && power > 4) break;

      if (power > 0 && power <= 4) {
        output.push({
          angle: i,
          power,
          timing,
          mark: ''
        })

        if (mobileTiming.length > 0 && parseFloat(timing) > mobileTiming[0].time) {
          output[output.length >= 2 ? output.length - 2 : 0].mark = mobileTiming[0].label
          mobileTiming.shift()
        }
      }
    }

    return output
  }

  timing = () => (2 * this.b20()) / this.d20()

  b13 = () => this.hook ? 0 : this.specialWind()

  b14 = () => this._radians(this.angle + 0.00001)

  b15 = () => Math.cos(this.b14())

  b16 = () => Math.sin(this.b14())

  b17 = () => (800 / this.SCREEN_PART) * Math.abs(this.distance)

  b18 = () => Math.sqrt(this.b17() / ((2 * this.b15() * this.b16()) / (this.d20()) + (2 * this.d19() * this.b16() * this.b16()) / (this.d20() * this.d20())))

  b20 = () => this.b18() * this.b16()

  d14 = () => this.windAngle * (Math.PI / 180)

  d15 = () => Math.cos(this.d14())

  d16 = () => Math.sin(this.d14())

  d17 = () => this.d15() * this.b13()

  d18 = () => this.d16() * this.b13()

  d19 = () => this.d17() / (4.505 * this.mobileProps.windEffect)

  d20 = () => (this.mobileProps.weight * 67.474) - this.d18() / (this.mobileProps.windEffect * 4.505)

  _radians = (degrees) => degrees * (Math.PI / 180)

  _radianAngle = () => this.angle / 180 * Math.PI
}


