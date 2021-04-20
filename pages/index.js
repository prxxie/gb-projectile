import { useState, useEffect } from 'react'
import Slider, { Range } from 'rc-slider';
import AnglePicker from '../components/AnglePicker'
import Projectile from '../common/utils/Projectile'

import styles from '../styles/Home.module.scss'
import 'rc-slider/assets/index.css';
import { mobiles } from '../common/utils/mobiles'

export default function Home() {
  const [projectile, setProjectile] = useState(new Projectile(mobiles[0].mobileProps))

  const [windAngle, setWindAngle] = useState(0)
  const [angle, setAngle] = useState(0)
  const [wind, setWind] = useState(0)
  const [power, setPower] = useState(0)
  const [distance, setDistance] = useState(0)

  const [listAngle, setListAngle] = useState([])

  useEffect(() => {
    projectile
      .setAngle(angle)
      .setDistance(distance)
      .setWind(wind)
      .setWindAngle(windAngle)

    const currentPow = listAngle.filter(n => n.angle == angle)[0]
    setPower(currentPow ? currentPow.power : 0)
    setListAngle(projectile.autoCalculate())

  }, [wind, windAngle, angle, distance, projectile]);

  return (
    <div className={styles.container}>
      <div className={styles.windAngleContainer}>
        <AnglePicker
          border={5}
          value={1 - windAngle / 360}
          onChange={(x, y) => setWindAngle((1 - y) * 360)}
        />
        <p>{wind}</p>
        <select onChange={(e) => setProjectile(new Projectile(mobiles[e.target.value].mobileProps))}>
          {
            mobiles.map((m, i) => <option key={i} value={i}>{m.name}</option>)
          }
        </select>
      </div>

      <div className={styles.distanceContainer}>
        <label>Distance: {distance}</label>
        <Slider
          value={distance}
          min={-16}
          max={16}
          step={0.25}
          onChange={v => setDistance(v)}
        />
      </div>

      <label>Power: {power}</label>

      <div className={styles.windVsAngle}>
        <div className={styles.windContainer}>
          <label>Wind: {wind}</label>
          <Slider
            vertical
            value={wind}
            min={0}
            max={26}
            step={1}
            onChange={v => setWind(v)}
          />
        </div>

        <div className={styles.angleContainer}>
          <label>Angle: {angle}</label>
          <Slider
            vertical
            value={angle}
            min={listAngle[0] && listAngle[0].angle}
            max={listAngle[listAngle.length - 1] && listAngle[listAngle.length - 1].angle}
            step={1}
            marks={listAngle.reduce((acc, n) => {
              if (n.mark) {
                acc[n.angle] = n.mark
              }

              return acc
            }, {})}
            onChange={v => setAngle(v)}
          />
        </div>
      </div>
    </div>
  )
}
