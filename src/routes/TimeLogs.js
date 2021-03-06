import React from 'react'
import { withCookies } from 'react-cookie'
import { Link } from 'react-router-dom'
import LazyLoad from 'react-lazyload'
import moment from 'moment'
import getIsoWeek from 'date-fns/get_iso_week'

import TopBar from '../components/TopBar'
import Brand from '../components/Brand'
import Footer from '../components/Footer'
import OnlineCount from '../components/OnlineCount'
import CircleButton from '../components/CircleButton'
import Copyright from '../components/Copyright';

import { GlobalContext } from '../lib/context'
import { TASK_KEY_FORMAT } from '../lib/constants'
import { css } from '../config/themes'

const padding = {
  paddingTop: '1rem',
  paddingBottom: '1rem'
}

const WeekLog = ({ logs, weekNum }) => {
  const days = moment.weekdaysShort()
  const currDate = moment()

  return (
    <LazyLoad once={true} height={500}>
      <>
        <div className='columns is-vcentered'>
          <div className='column is-size-5 has-text-weight-semibold has-text-left'>WEEK {weekNum}</div>
          <div className='column is-size-5 has-text-weight-semibold has-text-right'>{moment().year()}</div>
        </div>
        <div className='columns' style={{ marginBottom: '2.5rem' }}>
          {days.map((d, i) => {
            const targetDate = moment().week(weekNum).day(i)
            const key = targetDate.format(TASK_KEY_FORMAT)
            const totalSec = logs[key] ? logs[key].reduce((acc, task) => acc += task.length, 0) : 0
            const disabled = targetDate.isAfter(currDate) ? 'disabled' : ''

            const minSpent = Math.trunc((totalSec % 3600) / 60)
            const hrSpent = Math.trunc(totalSec / 3600)

            return <div key={`weeklog-${i}`} className='column'>
              <div className={`logs-header has-text-weight-semibold ${disabled}`}
                style={{
                  ...padding,
                }}>
                {targetDate.format('ddd, MMM D')}
              </div>
              <div className='logs-header has-text-weight-semibold'
                style={{
                  ...padding,
                }}>
                Total {totalSec > 0 ? `${hrSpent}h ${minSpent}m` : 0}
              </div>
              <div style={padding}>
                {logs[key] &&
                  logs[key].map((task, i) => (
                    <div key={`taskduration-${i}-${performance.now()}`}>
                      {task.type} {task.length < 60 ? '<1m' : `${Math.trunc(task.length / 60)}m`}
                    </div>
                  ))}
              </div>
            </div>
          })}
        </div>
      </>
    </LazyLoad>
  )
}

const TimeLogsComponent = (props) => {
  console.log(document.cookie)
  fetch('http://localhost:8000/cookie', {
    credentials: 'include'
  }).then(response => response.json()).then(json => console.log(json));

  const logs = JSON.parse(localStorage.getItem('logs')) || {}
  const weekYear = getIsoWeek(new Date())
  const weeksInYear = [...Array(weekYear).keys()]

  return (
    <GlobalContext.Consumer>
      {({ theme, toggleTheme }) => (
        <>
          <TopBar
            brand={<Brand theme={theme} />}
            mid={<OnlineCount />}
            end={<Navigation />} />
          <div className='container'>
            <div className='columns is-vcentered'>
              <div className='column is-size-2 has-text-weight-semibold has-text-centered'>Logs</div>
            </div>
            {weeksInYear.map((curr, index, arr) => (
              <WeekLog key={`weeklog-${index}`}
                logs={logs}
                weekNum={arr.length - index} />
            ))}
          </div>
          <Footer>
            <div className='content'
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-end'
              }}>
              <Copyright />
              <div>
                <CircleButton
                  className='button'
                  onClick={toggleTheme}
                  backgroundColor={css[theme].color}
                  size='1.5rem' />
                {/* <a className='icon button theme'
                  href='#' style={{ color: '#ffffff', backgroundColor: '#212529' }}>
                  <i className='ion-ionic ion-md-help'></i>
                </a> */}
              </div>
            </div>
          </Footer>
        </>
      )}
    </GlobalContext.Consumer>
  )
}

const Navigation = () => {
  return (
    <div className='navbar-end'>
      <div className='navbar-item'>
        <div className='field is-grouped'>
          <p className='control'>
            <Link to='/login'
              className='nav-btn button not-outlined has-text-weight-semibold fat-border'>Login</Link>
          </p>
          <p className='control'>
            <Link to='/register'
              className='nav-btn button has-text-weight-semibold fat-border'>Create a free account</Link>
          </p>
        </div>
      </div>
    </div>
  )
}


export const TimeLogs = withCookies(TimeLogsComponent);