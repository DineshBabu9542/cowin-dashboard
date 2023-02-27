// Write your code here

import {Component} from 'react'

import Loader from 'react-loader-spinner'

import VaccinationCoverage from '../VaccinationCoverage'
import VaccinationByGender from '../VaccinationByGender'
import VaccinationByAge from '../VaccinationByAge'

import './index.css'

const apiStatusConstant = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  progress: 'PROGRESS',
}

class CowinDashboard extends Component {
  state = {
    apiStatus: apiStatusConstant.initial,
    vaccineData: {},
  }

  componentDidMount() {
    this.getSuccessAndFailureStatus()
  }

  getSuccessAndFailureStatus = async () => {
    this.setState({
      apiStatus: apiStatusConstant.inProgress,
    })

    const covidVaccinationDataApiUrl =
      'https://apis.ccbp.in/covid-vaccination-data'

    const response = await fetch(covidVaccinationDataApiUrl)
    if (response.ok === true) {
      const fetchedData = await response.json()
      const updatedData = {
        last7DaysVaccination: fetchedData.last_7_days_vaccination.map(
          eachDayData => ({
            vaccineDate: eachDayData.vaccine_date,
            dose1: eachDayData.dose_1,
            dose2: eachDayData.dose_2,
          }),
        ),
        vaccinationByAge: fetchedData.vaccination_by_age.map(range => ({
          age: range.age,
          count: range.count,
        })),
        vaccinationByGender: fetchedData.vaccination_by_gender.map(
          genderType => ({
            gender: genderType.gender,
            count: genderType.count,
          }),
        ),
      }
      this.setState({
        vaccineData: updatedData,
        apiStatus: apiStatusConstant.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstant.failure})
    }
  }

  renderFailurePart = () => (
    <div className="failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/api-failure-view.png "
        className="failure-image"
        alt="failure view"
      />
      <h1 className="failure-description">Something went wrong</h1>
    </div>
  )

  renderSuccessPart = () => {
    const {vaccineData} = this.state
    console.log(vaccineData)

    return (
      <>
        <VaccinationCoverage
          vaccinationCoverageDetails={vaccineData.last7DaysVaccination}
        />
        <VaccinationByGender
          vaccinationByGenderDetails={vaccineData.vaccinationByGender}
        />
        <VaccinationByAge
          vaccinationByAgeDetails={vaccineData.vaccinationByAge}
        />
      </>
    )
  }

  renderProgress = () => (
    <div data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height={80} width={80} />
    </div>
  )

  renderComponents = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstant.success:
        return this.renderSuccessPart()
      case apiStatusConstant.failure:
        return this.renderFailurePart()

      case apiStatusConstant.progress:
        return this.renderProgress()

      default:
        return null
    }
  }

  render() {
    return (
      <div className="container">
        <div className="co-win-container">
          <div>
            <img
              src="https://assets.ccbp.in/frontend/react-js/cowin-logo.png"
              alt="website logo"
              className="website-logo-img"
            />
          </div>
          <h1 className="co-win-name">Co-WIN</h1>
        </div>
        <div className="objects-container">
          <h1 className="cow-in-sub-heading">CoWIN Vaccination in India</h1>
          {this.renderComponents()}
        </div>
      </div>
    )
  }
}

export default CowinDashboard
