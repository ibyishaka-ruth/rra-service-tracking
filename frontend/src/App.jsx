import { useEffect, useState } from 'react'
import './App.css'

const translations = {
  rw: {
    languageLabel: 'Ururimi',
    navLabel: 'Ibikubiye ku rubuga',
    receptionTab: 'Aho bakirira abasora',
    feedbackTab: 'Tanga igitekerezo',
    receptionEyebrow: 'AKAZI KO KWAKIRA ABASORA',
    receptionTitle: 'Kwakira no kuyobora umusoreshwa',
    receptionIntro: 'Andika TIN y’imibare 9, uhitemo serivisi akeneye. Niba TIN itarandikwa muri iyi prototype, tuzayibika hano mbere yo kwandika serivisi; ntituragenzura amakuru muri sisitemu ya RRA.',
    receptionPanelTitle: 'Kwandika umusoreshwa mushya',
    receptionSuccessTitle: 'Umusoreshwa yanditswe neza',
    receptionTin: 'TIN y’umusoreshwa',
    tinPlaceholder: 'Imibare 9 ya TIN',
    tinHint: 'TIN igomba kuba igizwe n’imibare 9 gusa.',
    serviceSearch: 'Shakisha serivisi',
    serviceSearchPlaceholder: 'Andika izina rya serivisi cyangwa ijambo rifasha kuyishaka',
    noServicesMatch: 'Nta serivisi ihuye n’ayo magambo wabonye.',
    serviceType: 'Serivisi umusoreshwa akeneye',
    chooseService: 'Hitamo serivisi',
    reason: 'Ibisobanuro by’inyongera',
    reasonOptional: '(si ngombwa)',
    reasonPlaceholder: 'Andika mu magambo make icyo umusoreshwa akeneye',
    createTicket: 'Mwandike muri sisitemu, umuyobore',
    creatingTicket: 'Turimo kwandika…',
    categoriesLoading: 'Turimo kureba serivisi zihari…',
    noCategories: 'Nta serivisi ziriho ubu. Baza umuyobozi wa sisitemu.',
    catalogNeedsRestart: 'Urutonde rwa serivisi ntirurimo amakuru mashya. Ongera utangize backend ivuguruye kuri port 8082, hanyuma wongere ufungure uru rubuga.',
    invalidTin: 'TIN igomba kuba imibare 9 gusa.',
    selectServiceError: 'Hitamo serivisi umusoreshwa akeneye.',
    taxpayerNotFound: 'Ntibyashobotse kwandika umusoreshwa ukoresheje iyi TIN. Reba TIN wongere ugerageze.',
    taxpayerRegistrationFailed: 'Ntibyashobotse kubika umusoreshwa muri prototype. Ongera ugerageze cyangwa ubaze umuyobozi wa sisitemu.',
    categoryUnavailable: 'Serivisi wahisemo ntikiboneka. Ongera uyihitemo.',
    ticketCreated: 'Umusoreshwa yanditswe neza',
    issuedTicket: 'Nimero y’ubusabe bwa serivisi',
    visitNumber: 'Nimero yo kwinjira',
    directTo: 'Yohereze kuri',
    serviceUnit: 'Ishami rito / aho ajya',
    nextTaxpayer: 'Kwakira undi musoreshwa',
    serviceErrorAfterCheckin: (visitId) => `Kwinjira byanditswe (nimero yo kwinjira ${visitId}), ariko nimero ya serivisi ntiyabonetse. Bika iyi nimero maze usabe ubufasha bw’umuyobozi wa sisitemu.`,
    missingDepartment: 'Iyi serivisi ntirashyirwa mu ishami. Bwira umuyobozi wa sisitemu kurihuza n’ishami.',
    receptionNote: 'Nimero y’ubusabe n’ishami bigaragazwa nyuma yo kwandika umusoreshwa.',
    categoryFetchFailed: 'Ntibyashobotse kureba serivisi zihari. Ongera ufungure uru rubuga.',
    portal: 'URUBUGA RWA SERIVISI Z’ABASORESHA',
    tagline: 'IMISORO MU ITERAMBERE',
    nav: ['Imisoro y’imbere mu gihugu', 'Serivisi za Gasutamo', 'Serivisi za EBM', 'Inyandiko', 'Rwanda Trade Portal'],
    eyebrow: 'SERIVISI Z’ABASORESHA ZA RRA',
    title: 'Tubwire uko twagufashije',
    intro: 'Ibitekerezo byawe bidufasha kunoza serivisi duha abasora. Tanga igitekerezo cyawe nyuma yo guhabwa serivisi.',
    stepFind: 'Shaka serivisi warangije guhabwa',
    findHint: 'Andika nomero iranga ubusabe bwa serivisi wahawe.',
    requestId: 'Nomero y’ubusabe bwa serivisi',
    exampleId: 'urugero: 1',
    verify: 'Emeza serivisi',
    verifying: 'Turagenzura…',
    verifyHint: 'Tuzabanza kugenzura ko serivisi warangije kuyihabwa.',
    invalidId: 'Andika nomero yuzuye irenze zeru.',
    statuses: { PENDING: 'iracyategerejwe', IN_PROGRESS: 'iracyakorwa', NOT_COMPLETED: 'ntiyarangiye' },
    statusNotCompleted: (status) => `Ubusabe bwa serivisi ${status}. Ushobora gutanga igitekerezo ari uko serivisi warangije kuyihabwa.`,
    serviceNotFound: 'Ntabwo twabonye ubwo busabe bwa serivisi. Reba nomero wongere ugerageze.',
    alreadySubmitted: 'Igitekerezo kuri ubu busabe gishobora kuba cyaratanzwe. Buri serivisi yakira igitekerezo kimwe gusa.',
    networkError: 'Ntibyashobotse kugera kuri seriveri. Ongera ugerageze.',
    genericError: 'Habaye ikibazo mu gihe cyo gukora ubusabe. Ongera ugerageze.',
    completed: 'BYARANGIYE',
    verified: 'Serivisi yemejwe',
    request: 'Ubusabe',
    stepRate: 'Tanga amanota kuri serivisi',
    ratingHint: 'Hitamo amanota, unongeremo ibisobanuro niba ubishaka.',
    rating: 'Amanota utanga',
    selectRating: 'Hitamo inyenyeri 1 kugeza kuri 5',
    starsOutOf: (rating) => `Inyenyeri ${rating} kuri 5`,
    star: 'inyenyeri',
    stars: 'inyenyeri',
    comment: 'Ibindi bisobanuro',
    optional: '(si ngombwa)',
    commentPlaceholder: 'Ni iki cyagenze neza? Ni iki twanoza?',
    commentCount: (count) => `${count}/1.000 inyuguti`,
    linkedInfo: 'Igitekerezo cyawe gihuzwa n’ubusabe bwa serivisi.',
    submit: 'Ohereza igitekerezo',
    submitting: 'Turimo kohereza…',
    verifyBefore: 'Banza wemeze ko serivisi yarangiye mbere yo kohereza igitekerezo.',
    invalidRating: 'Hitamo amanota kuva kuri 1 kugeza kuri 5.',
    commentTooLong: 'Igitekerezo cyawe ntigishobora kurenza inyuguti 1.000.',
    successEyebrow: 'IGITEKEREZO CYAKIRIWE',
    successTitle: 'Urakoze kutugezaho igitekerezo cyawe',
    successBody: (rating, id) => `Igitekerezo cyawe cy’inyenyeri ${rating} ku busabe bwa serivisi #${id} cyakiriwe.`,
    submittedAt: (date) => `Cyatanzwe: ${date}`,
    another: 'Tanga igitekerezo ku yindi serivisi',
    privacy: 'Ibitekerezo byawe bidufasha kunoza serivisi. Irinde gushyiramo amakuru y’ibanga cyangwa ajyanye n’imisoro yawe.',
    footer: 'Urwego rw’Imisoro n’Amahoro mu Rwanda',
    footerSystem: 'Sisitemu ya Serivisi z’Abasora',
  },
  en: {
    languageLabel: 'Language',
    navLabel: 'Main navigation',
    receptionTab: 'Reception desk',
    feedbackTab: 'Give feedback',
    receptionEyebrow: 'TAXPAYER RECEPTION',
    receptionTitle: 'Welcome and direct the taxpayer',
    receptionIntro: 'Enter the 9-digit TIN and select the requested service. If the TIN is not in this prototype yet, it will be saved locally before check-in; it is not verified against RRA records.',
    receptionPanelTitle: 'Register a new visit',
    receptionSuccessTitle: 'Taxpayer checked in successfully',
    receptionTin: 'Taxpayer TIN',
    tinPlaceholder: '9-digit TIN',
    tinHint: 'TIN must contain exactly 9 digits.',
    serviceSearch: 'Search services',
    serviceSearchPlaceholder: 'Type a service name or keyword',
    noServicesMatch: 'No services match your search.',
    serviceType: 'Service requested',
    chooseService: 'Choose a service',
    reason: 'Additional details',
    reasonOptional: '(optional)',
    reasonPlaceholder: 'Briefly describe what the taxpayer needs',
    createTicket: 'Check in and direct taxpayer',
    creatingTicket: 'Recording…',
    categoriesLoading: 'Loading available services…',
    noCategories: 'There are no active services. Please contact the system administrator.',
    catalogNeedsRestart: 'The service list is outdated. Restart the updated backend on port 8082, then reload this page.',
    invalidTin: 'TIN must contain exactly 9 digits.',
    selectServiceError: 'Choose the service the taxpayer needs.',
    taxpayerNotFound: 'The taxpayer could not be checked in with this TIN. Check the number and try again.',
    taxpayerRegistrationFailed: 'The taxpayer could not be saved in the prototype. Please try again or contact the system administrator.',
    categoryUnavailable: 'The selected service is no longer available. Please choose another.',
    ticketCreated: 'Taxpayer checked in successfully',
    issuedTicket: 'Service request number',
    visitNumber: 'Visit number',
    directTo: 'Direct taxpayer to',
    serviceUnit: 'Destination sub-unit',
    nextTaxpayer: 'Check in another taxpayer',
    serviceErrorAfterCheckin: (visitId) => `Check-in was recorded (visit number ${visitId}), but the service request number could not be created. Keep this visit number and contact the system administrator.`,
    missingDepartment: 'This service has not been assigned to a department. Ask the system administrator to configure it.',
    receptionNote: 'The service request number and destination department appear after check-in.',
    categoryFetchFailed: 'Available services could not be loaded. Please reload this page.',
    portal: 'TAXPAYER SERVICE PORTAL',
    tagline: 'TAXES FOR GROWTH AND DEVELOPMENT',
    nav: ['Domestic Taxes', 'Customs Services', 'EBM Services', 'Documents', 'Rwanda Trade Portal'],
    eyebrow: 'RRA TAXPAYER SERVICES',
    title: 'Tell us how we did',
    intro: 'Your feedback helps us improve the service we provide to every taxpayer. Share your experience after your service is completed.',
    stepFind: 'Find your completed service',
    findHint: 'Enter the service request ID shown on your service record.',
    requestId: 'Service request ID',
    exampleId: 'e.g. 1',
    verify: 'Verify service',
    verifying: 'Checking…',
    verifyHint: 'We’ll confirm the service is completed before you continue.',
    invalidId: 'Enter a whole service request ID greater than zero.',
    statuses: { PENDING: 'is pending', IN_PROGRESS: 'is still in progress', NOT_COMPLETED: 'was not completed' },
    statusNotCompleted: (status) => `This service request ${status}. Feedback is available only after a service is completed.`,
    serviceNotFound: 'We could not find that service request. Check the ID and try again.',
    alreadySubmitted: 'Feedback may already have been submitted for this service request. Each completed service accepts one feedback submission.',
    networkError: 'We could not reach the server. Please try again.',
    genericError: 'Something went wrong while processing your request. Please try again.',
    completed: 'COMPLETED',
    verified: 'Service verified',
    request: 'Request',
    stepRate: 'Rate your experience',
    ratingHint: 'Choose a rating and share any details you’d like.',
    rating: 'Your rating',
    selectRating: 'Select 1 to 5 stars',
    starsOutOf: (rating) => `${rating} out of 5 stars`,
    star: 'star',
    stars: 'stars',
    comment: 'Additional comments',
    optional: '(optional)',
    commentPlaceholder: 'What went well? What could we improve?',
    commentCount: (count) => `${count}/1,000 characters`,
    linkedInfo: 'Your feedback is linked to this service request.',
    submit: 'Submit feedback',
    submitting: 'Submitting…',
    verifyBefore: 'Verify a completed service request before submitting feedback.',
    invalidRating: 'Choose a rating from 1 to 5 stars.',
    commentTooLong: 'Your comment must be 1,000 characters or fewer.',
    successEyebrow: 'FEEDBACK RECEIVED',
    successTitle: 'Thank you for sharing',
    successBody: (rating, id) => `Your ${rating}-star feedback for service request #${id} has been recorded.`,
    submittedAt: (date) => `Submitted ${date}`,
    another: 'Give feedback on another service',
    privacy: 'Feedback is used to improve taxpayer services. Please don’t include sensitive personal or tax information.',
    footer: 'Rwanda Revenue Authority',
    footerSystem: 'Taxpayer Service System',
  },
}

async function readApiResponse(response, text, errors = {}) {
  let payload

  try {
    payload = await response.json()
  } catch {
    payload = null
  }

  if (!response.ok) {
    const message = response.status === 404
      ? errors.notFound || text.serviceNotFound
      : response.status === 409
        ? errors.conflict || text.alreadySubmitted
        : errors.other || text.genericError
    throw new Error(message)
  }

  if (!payload) {
    throw new Error(text.genericError)
  }

  return payload
}

function App() {
  const [language, setLanguage] = useState('rw')
  const [activeView, setActiveView] = useState('reception')
  const [categories, setCategories] = useState([])
  const [categoriesLoading, setCategoriesLoading] = useState(true)
  const [categoriesLoadFailed, setCategoriesLoadFailed] = useState(false)
  const [catalogNeedsRestart, setCatalogNeedsRestart] = useState(false)
  const [tin, setTin] = useState('')
  const [serviceSearch, setServiceSearch] = useState('')
  const [selectedCategoryId, setSelectedCategoryId] = useState('')
  const [reason, setReason] = useState('')
  const [receptionError, setReceptionError] = useState('')
  const [isCreatingTicket, setIsCreatingTicket] = useState(false)
  const [createdTicket, setCreatedTicket] = useState(null)
  const [serviceRequestId, setServiceRequestId] = useState('')
  const [verifiedRequest, setVerifiedRequest] = useState(null)
  const [rating, setRating] = useState('')
  const [comment, setComment] = useState('')
  const [verificationError, setVerificationError] = useState('')
  const [submissionError, setSubmissionError] = useState('')
  const [feedback, setFeedback] = useState(null)
  const [isVerifying, setIsVerifying] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const requestId = Number(serviceRequestId)
  const validRequestId =
    Number.isSafeInteger(requestId) && requestId > 0 && serviceRequestId.trim() !== ''
  const text = translations[language]
  const filteredCategories = categories.filter((category) => {
    const query = serviceSearch.trim().toLocaleLowerCase()
    if (!query) return true
    const searchableValues = [category.name, ...(category.commonKeywords || [])]
    return searchableValues.some((value) => value.toLocaleLowerCase().includes(query))
  })

  useEffect(() => {
    document.documentElement.lang = language
    document.title = `${text.title} | RRA Taxpayer Services`
  }, [language, text.title])

  useEffect(() => {
    let isCurrent = true

    async function loadCategories() {
      setCategoriesLoading(true)
      setCategoriesLoadFailed(false)
      setCatalogNeedsRestart(false)
      try {
        const response = await fetch('/api/v1/service-categories')
        const availableCategories = await readApiResponse(response, text)
        if (isCurrent) {
          const activeCategories = availableCategories.filter((category) => category.active)
          const configuredCategories = activeCategories.filter((category) => category.routingCode)
          setCategories(availableCategories.filter(
            (category) => category.active && category.routingCode,
          ))
          setCatalogNeedsRestart(activeCategories.length > 0 && configuredCategories.length === 0)
        }
      } catch {
        if (isCurrent) {
          setCategoriesLoadFailed(true)
        }
      } finally {
        if (isCurrent) {
          setCategoriesLoading(false)
        }
      }
    }

    loadCategories()
    return () => {
      isCurrent = false
    }
  }, [text])

  function changeLanguage(nextLanguage) {
    setLanguage(nextLanguage)
    setVerificationError('')
    setSubmissionError('')
    setReceptionError('')
  }

  function handleRequestIdChange(event) {
    setServiceRequestId(event.target.value)
    setVerifiedRequest(null)
    setRating('')
    setComment('')
    setVerificationError('')
    setSubmissionError('')
    setFeedback(null)
  }

  async function verifyRequest(event) {
    event.preventDefault()
    setVerificationError('')
    setSubmissionError('')
    setVerifiedRequest(null)

    if (!validRequestId) {
      setVerificationError(text.invalidId)
      return
    }

    setIsVerifying(true)

    try {
      const response = await fetch(`/api/v1/service-requests/${requestId}`)
      const request = await readApiResponse(response, text)

      if (request.status !== 'COMPLETED') {
        const status = text.statuses[request.status] || request.status?.replaceAll('_', ' ') || 'not completed'
        setVerificationError(text.statusNotCompleted(status))
        return
      }

      setVerifiedRequest(request)
    } catch (error) {
      setVerificationError(
        error instanceof TypeError
          ? text.networkError
          : error instanceof Error
          ? error.message
          : text.genericError,
      )
    } finally {
      setIsVerifying(false)
    }
  }

  async function submitFeedback(event) {
    event.preventDefault()
    setSubmissionError('')

    if (!verifiedRequest || Number(verifiedRequest.id) !== requestId) {
      setSubmissionError(text.verifyBefore)
      return
    }

    const selectedRating = Number(rating)
    if (!Number.isInteger(selectedRating) || selectedRating < 1 || selectedRating > 5) {
      setSubmissionError(text.invalidRating)
      return
    }

    if (comment.length > 1000) {
      setSubmissionError(text.commentTooLong)
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/v1/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceRequestId: requestId,
          rating: selectedRating,
          comment: comment.trim() || null,
        }),
      })

      setFeedback(await readApiResponse(response, text))
    } catch (error) {
      setSubmissionError(
        error instanceof TypeError
          ? text.networkError
          : error instanceof Error
          ? error.message
          : text.genericError,
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  function startAnotherFeedback() {
    setServiceRequestId('')
    setVerifiedRequest(null)
    setRating('')
    setComment('')
    setVerificationError('')
    setSubmissionError('')
    setFeedback(null)
  }

  function startAnotherCheckIn() {
    setTin('')
    setServiceSearch('')
    setSelectedCategoryId('')
    setReason('')
    setReceptionError('')
    setCreatedTicket(null)
  }

  async function createReceptionTicket(event) {
    event.preventDefault()
    setReceptionError('')

    if (!/^\d{9}$/.test(tin)) {
      setReceptionError(text.invalidTin)
      return
    }

    const category = categories.find((item) => String(item.id) === selectedCategoryId)
    if (!category) {
      setReceptionError(text.selectServiceError)
      return
    }
    if (!category.defaultDepartmentId || !category.defaultDepartmentName) {
      setReceptionError(text.missingDepartment)
      return
    }

    setIsCreatingTicket(true)

    try {
      const checkIn = () => fetch('/api/v1/visits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tin }),
      })
      let visitResponse = await checkIn()
      if (visitResponse.status === 404) {
        const taxpayerResponse = await fetch('/api/v1/taxpayers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tin }),
        })
        if (taxpayerResponse.status !== 409) {
          await readApiResponse(taxpayerResponse, text, {
            other: text.taxpayerRegistrationFailed,
          })
        }
        visitResponse = await checkIn()
      }
      const visit = await readApiResponse(visitResponse, text, {
        notFound: text.taxpayerNotFound,
      })

      try {
        const requestResponse = await fetch('/api/v1/service-requests', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            visitId: visit.id,
            serviceCategoryId: category.id,
            reason: reason.trim() || category.name,
          }),
        })
        const serviceRequest = await readApiResponse(requestResponse, text, {
          notFound: text.categoryUnavailable,
        })
        setCreatedTicket({ visit, serviceRequest })
      } catch (error) {
        setReceptionError(
          error instanceof TypeError
            ? text.serviceErrorAfterCheckin(visit.id)
            : error instanceof Error
              ? `${error.message} ${text.serviceErrorAfterCheckin(visit.id)}`
              : text.serviceErrorAfterCheckin(visit.id),
        )
      }
    } catch (error) {
      setReceptionError(
        error instanceof TypeError
          ? text.networkError
          : error instanceof Error
            ? error.message
            : text.genericError,
      )
    } finally {
      setIsCreatingTicket(false)
    }
  }

  return (
    <div className="app-shell" lang={language}>
      <div className="top-rule" />
      <header className="site-header">
        <div className="masthead">
          <a className="brand" href="/" aria-label="Rwanda Revenue Authority home">
            <span className="brand-mark" aria-hidden="true">
              <span>R</span>
            </span>
            <span className="brand-name">
              <strong><span>RWANDA REVENUE</span> AUTHORITY</strong>
              <span>{text.tagline}</span>
            </span>
          </a>
          <div className="header-actions">
            <span className="portal-label">{text.portal}</span>
            <div className="language-switch" role="group" aria-label={text.languageLabel}>
              <button
                type="button"
                className={language === 'rw' ? 'selected' : ''}
                aria-pressed={language === 'rw'}
                onClick={() => changeLanguage('rw')}
              >
                Kinyarwanda
              </button>
              <button
                type="button"
                className={language === 'en' ? 'selected' : ''}
                aria-pressed={language === 'en'}
                onClick={() => changeLanguage('en')}
              >
                English
              </button>
            </div>
          </div>
        </div>
        <nav className="primary-nav" aria-label={text.navLabel}>
          {text.nav.map((item, index) => (
            <span className={index === 0 ? 'active' : ''} key={item}>{item}</span>
          ))}
        </nav>
      </header>

      <main>
        <div className="workspace-tabs" role="group" aria-label={text.portal}>
          <button
            className={activeView === 'reception' ? 'active' : ''}
            type="button"
            aria-pressed={activeView === 'reception'}
            onClick={() => setActiveView('reception')}
          >
            {text.receptionTab}
          </button>
          <button
            className={activeView === 'feedback' ? 'active' : ''}
            type="button"
            aria-pressed={activeView === 'feedback'}
            onClick={() => setActiveView('feedback')}
          >
            {text.feedbackTab}
          </button>
        </div>

        <section className="intro" aria-labelledby="page-title">
          <div className="intro-copy">
            <p className="eyebrow">
              {activeView === 'reception' ? text.receptionEyebrow : text.eyebrow}
            </p>
            <h1 id="page-title">
              {activeView === 'reception' ? text.receptionTitle : text.title}
            </h1>
            <p>{activeView === 'reception' ? text.receptionIntro : text.intro}</p>
          </div>
          <div className="intro-art" aria-hidden="true">
            <div className="art-document">
              <span />
              <span />
              <span />
              <b>✓</b>
            </div>
            <div className="art-coin coin-one">RWF</div>
            <div className="art-coin coin-two">★</div>
            <div className="art-sun" />
          </div>
        </section>

        {activeView === 'reception' ? (
          <section className="feedback-card reception-card" aria-label={text.receptionTitle}>
            {createdTicket ? (
              <div className="ticket-result" role="status" aria-live="polite">
                <div className="success-icon" aria-hidden="true">✓</div>
                <p className="eyebrow">{text.ticketCreated}</p>
                <h2>{text.receptionSuccessTitle}</h2>
                <div className="ticket-number">
                  <span>{text.issuedTicket}</span>
                  <strong>#{createdTicket.serviceRequest.id}</strong>
                </div>
                <div className="ticket-details">
                  <div>
                    <span>{text.serviceType}</span>
                    <strong>{createdTicket.serviceRequest.serviceCategoryName}</strong>
                  </div>
                  <div>
                    <span>{text.directTo}</span>
                    <strong>{createdTicket.serviceRequest.departmentName}</strong>
                  </div>
                  <div>
                    <span>{text.serviceUnit}</span>
                    <strong>{createdTicket.serviceRequest.subUnit || '—'}</strong>
                  </div>
                  <div>
                    <span>{text.receptionTin}</span>
                    <strong>{createdTicket.visit.tin}</strong>
                  </div>
                  <div>
                    <span>{text.visitNumber}</span>
                    <strong>#{createdTicket.visit.id}</strong>
                  </div>
                </div>
                <p className="ticket-direction">{text.directTo}: <strong>{createdTicket.serviceRequest.departmentName}</strong></p>
                <button className="button button-primary" type="button" onClick={startAnotherCheckIn}>
                  {text.nextTaxpayer}
                </button>
              </div>
            ) : (
              <>
                <div className="card-heading">
                  <span className="step-number">01</span>
                  <div>
                    <h2>{text.receptionPanelTitle}</h2>
                    <p>{text.receptionNote}</p>
                  </div>
                </div>

                <form className="reception-form" onSubmit={createReceptionTicket} noValidate>
                  <div className="form-field">
                    <label htmlFor="taxpayer-tin">{text.receptionTin}</label>
                    <input
                      id="taxpayer-tin"
                      name="tin"
                      type="text"
                      inputMode="numeric"
                      autoComplete="off"
                      maxLength="9"
                      pattern="[0-9]{9}"
                      placeholder={text.tinPlaceholder}
                      value={tin}
                      onChange={(event) => {
                        setTin(event.target.value.replace(/\D/g, '').slice(0, 9))
                        setReceptionError('')
                      }}
                      aria-invalid={Boolean(receptionError)}
                      required
                    />
                    <p className="field-hint">{text.tinHint} ({tin.length}/9)</p>
                  </div>

                  <div className="form-field">
                    <label htmlFor="service-search">{text.serviceSearch}</label>
                    <input
                      id="service-search"
                      name="serviceSearch"
                      type="search"
                      placeholder={text.serviceSearchPlaceholder}
                      value={serviceSearch}
                      onChange={(event) => {
                        setServiceSearch(event.target.value)
                        setSelectedCategoryId('')
                        setReceptionError('')
                      }}
                      disabled={categoriesLoading || categoriesLoadFailed}
                    />
                    <label className="select-label" htmlFor="service-category">{text.serviceType}</label>
                    <select
                      id="service-category"
                      name="serviceCategoryId"
                      value={selectedCategoryId}
                      onChange={(event) => {
                        setSelectedCategoryId(event.target.value)
                        setReceptionError('')
                      }}
                      disabled={categoriesLoading || categoriesLoadFailed || categories.length === 0}
                      required
                    >
                      <option value="">
                        {categoriesLoading ? text.categoriesLoading : text.chooseService}
                      </option>
                      {filteredCategories.map((category) => (
                        <option
                          key={category.id}
                          value={category.id}
                          disabled={!category.defaultDepartmentId || !category.defaultDepartmentName}
                        >
                          {category.name} — {category.defaultDepartmentName || text.missingDepartment}
                          {category.subUnit ? ` — ${category.subUnit}` : ''}
                        </option>
                      ))}
                    </select>
                    {categoriesLoadFailed && (
                      <p className="error-message" role="alert">{text.categoryFetchFailed}</p>
                    )}
                    {!categoriesLoadFailed && !categoriesLoading && categories.length === 0 && (
                      <p
                        className={catalogNeedsRestart ? 'error-message' : 'field-hint'}
                        role={catalogNeedsRestart ? 'alert' : undefined}
                      >
                        {catalogNeedsRestart ? text.catalogNeedsRestart : text.noCategories}
                      </p>
                    )}
                    {!categoriesLoadFailed && !categoriesLoading && categories.length > 0 && filteredCategories.length === 0 && (
                      <p className="field-hint">{text.noServicesMatch}</p>
                    )}
                  </div>

                  <div className="form-field">
                    <label htmlFor="reception-reason">
                      {text.reason} <span>{text.reasonOptional}</span>
                    </label>
                    <textarea
                      id="reception-reason"
                      name="reason"
                      rows="3"
                      maxLength="1000"
                      placeholder={text.reasonPlaceholder}
                      value={reason}
                      onChange={(event) => setReason(event.target.value)}
                    />
                  </div>

                  {receptionError && (
                    <p className="error-message" role="alert">{receptionError}</p>
                  )}

                  <div className="form-footer">
                    <p>{text.receptionIntro}</p>
                    <button
                      className="button button-primary"
                      type="submit"
                      disabled={isCreatingTicket || categoriesLoading || categoriesLoadFailed}
                    >
                      {isCreatingTicket ? text.creatingTicket : text.createTicket}
                    </button>
                  </div>
                </form>
              </>
            )}
          </section>
        ) : (
        <section className="feedback-card" aria-label={text.title}>
          {feedback ? (
            <div className="success-panel" role="status" aria-live="polite">
              <div className="success-icon" aria-hidden="true">✓</div>
              <p className="eyebrow">{text.successEyebrow}</p>
              <h2>{text.successTitle}</h2>
              <p>{text.successBody(feedback.rating, feedback.serviceRequestId)}</p>
              {feedback.submittedAt && (
                <p className="submitted-time">
                  {text.submittedAt(new Date(feedback.submittedAt).toLocaleString(language === 'rw' ? 'rw-RW' : 'en-RW'))}
                </p>
              )}
              <button className="button button-secondary" type="button" onClick={startAnotherFeedback}>
                {text.another}
              </button>
            </div>
          ) : (
            <>
              <div className="card-heading">
                <span className="step-number">01</span>
                <div>
                  <h2>{text.stepFind}</h2>
                  <p>{text.findHint}</p>
                </div>
              </div>

              <form className="request-form" onSubmit={verifyRequest} noValidate>
                <label htmlFor="service-request-id">{text.requestId}</label>
                <div className="request-row">
                  <input
                    id="service-request-id"
                    name="serviceRequestId"
                    type="number"
                    min="1"
                    step="1"
                    inputMode="numeric"
                    placeholder={text.exampleId}
                    value={serviceRequestId}
                    onChange={handleRequestIdChange}
                    aria-describedby={verificationError ? 'verification-error' : 'request-hint'}
                    aria-invalid={Boolean(verificationError)}
                    required
                  />
                  <button
                    className="button button-secondary"
                    type="submit"
                    disabled={isVerifying}
                  >
                    {isVerifying ? text.verifying : text.verify}
                  </button>
                </div>
                <p className="field-hint" id="request-hint">
                  {text.verifyHint}
                </p>
                {verificationError && (
                  <p className="error-message" id="verification-error" role="alert">
                    {verificationError}
                  </p>
                )}
              </form>

              {verifiedRequest && (
                <div className="verified-banner" role="status">
                  <span className="verified-icon" aria-hidden="true">✓</span>
                  <span>
                    <strong>{text.verified}</strong>
                    <span>
                      {text.request} #{verifiedRequest.id} · {verifiedRequest.serviceCategoryName}
                    </span>
                  </span>
                  <span className="status-pill">{text.completed}</span>
                </div>
              )}

              {verifiedRequest && (
                <form className="feedback-form" onSubmit={submitFeedback} noValidate>
                  <div className="card-heading form-heading">
                    <span className="step-number">02</span>
                    <div>
                      <h2>{text.stepRate}</h2>
                      <p>{text.ratingHint}</p>
                    </div>
                  </div>

                  <fieldset className="rating-field">
                    <legend>{text.rating}</legend>
                    <div className="rating-options" role="radiogroup" aria-label={text.rating}>
                      {[1, 2, 3, 4, 5].map((value) => (
                        <label
                          className={`rating-option${Number(rating) >= value ? ' selected' : ''}`}
                          key={value}
                          title={`${value} ${value === 1 ? text.star : text.stars}`}
                        >
                          <input
                            type="radio"
                            name="rating"
                            value={value}
                            checked={Number(rating) === value}
                            onChange={(event) => setRating(event.target.value)}
                            required
                          />
                          <span aria-hidden="true">★</span>
                          <span className="visually-hidden">
                            {value} {value === 1 ? text.star : text.stars}
                          </span>
                        </label>
                      ))}
                    </div>
                    <p className="field-hint">
                      {rating ? text.starsOutOf(rating) : text.selectRating}
                    </p>
                  </fieldset>

                  <label htmlFor="comment">{text.comment} <span>{text.optional}</span></label>
                  <textarea
                    id="comment"
                    name="comment"
                    rows="4"
                    maxLength="1000"
                    placeholder={text.commentPlaceholder}
                    value={comment}
                    onChange={(event) => setComment(event.target.value)}
                  />
                  <p className="field-hint character-count">{text.commentCount(comment.length)}</p>

                  {submissionError && (
                    <p className="error-message" role="alert">
                      {submissionError}
                    </p>
                  )}

                  <div className="form-footer">
                    <p>{text.linkedInfo}</p>
                    <button className="button button-primary" type="submit" disabled={isSubmitting}>
                      {isSubmitting ? text.submitting : text.submit}
                    </button>
                  </div>
                </form>
              )}
            </>
          )}
        </section>
        )}

        <p className="privacy-note">
          {activeView === 'reception' ? text.receptionNote : text.privacy}
        </p>
      </main>

      <footer className="site-footer">
        <span>{text.footer}</span>
        <span>{text.footerSystem}</span>
      </footer>
    </div>
  )
}

export default App
