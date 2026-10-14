import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import rraLogo from './assets/rra-logo.png'
import './App.css'

const translations = {
  rw: {
    languageLabel: 'Ururimi',
    workspaceLabel: 'IMIYOBORO',
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
    serviceSearchPlaceholder: 'Andika izina rya serivisi cyangwa ijambo rifasha kuyishaka',
    noServicesMatch: 'Nta serivisi ihuye n’ayo magambo wabonye.',
    serviceType: 'Serivisi umusoreshwa akeneye',
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
    useRequestForFeedback: 'Koresha iyi nimero mu gutanga igitekerezo',
    feedbackIdHint: 'Andika nimero y’ubusabe iri hejuru, si nimero yo kwinjira/visite. Igitekerezo gitangwa serivisi imaze kurangira.',
    serviceErrorAfterCheckin: (visitId) => `Kwinjira byanditswe (nimero yo kwinjira ${visitId}), ariko nimero ya serivisi ntiyabonetse. Bika iyi nimero maze usabe ubufasha bw’umuyobozi wa sisitemu.`,
    missingDepartment: 'Iyi serivisi ntirashyirwa mu ishami. Bwira umuyobozi wa sisitemu kurihuza n’ishami.',
    receptionNote: 'Nimero y’ubusabe n’ishami bigaragazwa nyuma yo kwandika umusoreshwa.',
    categoryFetchFailed: 'Ntibyashobotse kureba serivisi zihari. Ongera ufungure uru rubuga.',
    frontDeskTab: 'Front desk',
    adminFeedbackTab: 'Isuzuma ry’ibitekerezo',
    frontDeskEyebrow: 'GUKURIKIRANA UBUSABE',
    frontDeskTitle: 'Kugenera abakozi ubusabe',
    frontDeskIntro: 'Reba ubusabe bwageze mu mashami, ugenzure akazi kari kuri buri mukozi, hanyuma uyohereze ku mukozi ubishoboye.',
    queueTitle: 'Ubusabe bw’abasora',
    queueDescription: 'Shakisha ubusabe cyangwa uhitemo ishami kugira ngo uyobore akazi.',
    refreshQueue: 'Ongera urebe',
    queueLastUpdated: (time) => `Byavuguruwe: ${time}`,
    liveUpdatesConnected: 'Ubusabe bushya buzagaragara ako kanya.',
    liveUpdatesDisconnected: 'Uburyo bwo kwakira amakuru ako kanya ntibuhari. Koresha “Ongera urebe”.',
    queueLoading: 'Turimo kuzana ubusabe…',
    queueLoadError: 'Ntibyashobotse kuzana ubusabe. Ongera ugerageze.',
    outdatedBackend: 'Backend iri kuri port 8082 ishaje; nta API y’urutonde rw’ubusabe ifite. Ongera uyitangize ukoresheje verisiyo nshya, hanyuma wongere ugerageze.',
    queueSearchLabel: 'Shakisha ubusabe',
    queueSearchPlaceholder: 'Andika TIN, nimero y’ubusabe, serivisi cyangwa umukozi',
    departmentFilter: 'Amashami yose',
    allStatuses: 'Status zose',
    pendingStatus: 'Bitegereje',
    inProgressStatus: 'Birimo gukorwa',
    completedStatus: 'Byarangiye',
    openRequests: 'Ubusabe butarangiye',
    activeRequests: 'Ubusabe burimo gukorwa',
    completedRequests: 'Ubusabe bwarangiye',
    requestNumber: 'Ubusabe',
    requestDetails: 'Ibisobanuro',
    showRequestDetails: 'Reba ibisobanuro',
    hideRequestDetails: 'Funga ibisobanuro',
    newArrival: 'BUSHYA',
    incomingUnassigned: 'Abasora bategereje guhabwa umukozi',
    pendingAssignment: 'Bwakiriwe n’ishami — hitamo umukozi uzabukoraho.',
    taxpayerTin: 'TIN',
    serviceLabel: 'Serivisi',
    arrivedLabel: 'Igihe bwageze',
    assignedStaff: 'Umukozi ubiherewe',
    staffNamePlaceholder: 'Andika izina ry’umukozi',
    staffNameHint: 'Reba imibare y’akazi y’abakozi iri hejuru; ushobora no kwandika izina rishya.',
    staffLoadTitle: 'Uko abakozi bahuze',
    staffLoadEmpty: 'Nta mukozi urahabwa ubusabe.',
    activeLoad: (count) => `${count} busabe burimo gukorwa`,
    freeLoad: 'Nta busabe burimo gukorwa',
    workloadNote: 'Iyi mibare ibara gusa ubusabe bwahawe abakozi muri iyi sisitemu; ntigaragaza indi mirimo cyangwa kalendari zabo.',
    assignAndStart: 'Ohereza ku mukozi',
    assigning: 'Birimo koherezwa…',
    assignmentSuccess: (id, name) => `Ubusabe #${id} bwoherejwe kuri ${name}.`,
    noQueueMatches: 'Nta busabe buhuye n’iyo shakisha.',
    noRequestsYet: 'Nta busabe burandikwa. Ubusabe bushya buzakigaragara hano.',
    statusLabel: 'Imiterere',
    completionAction: 'Serivisi yarangiye',
    returnToQueue: 'Subiza ku rutonde',
    returnReasonLabel: 'Impamvu itararangira',
    returnReasonPlaceholder: 'Urugero: Umusoreshwa azanye inyandiko ibura',
    saveReturn: 'Bika, usubize ku rutonde',
    cancel: 'Reka',
    reasonRequired: 'Andika impamvu mbere yo gusubiza ubu busabe ku rutonde.',
    completeSuccess: (id) => `Ubusabe #${id} bwarangiye. Umusoreshwa ashobora gutanga igitekerezo.`,
    returnSuccess: (id) => `Ubusabe #${id} busubijwe ku rutonde kugira ngo bukurikiranwe.`,
    queuePrivacy: 'Iyi dashboard ni iya prototype: nta kwinjira kw’abakozi cyangwa urutonde rw’abakozi rwemewe birimo. Shyiramo amazina nk’uko yemejwe n’ubuyobozi.',
    feedbackAdminTitle: 'Isuzuma ry’ibitekerezo by’abasora',
    feedbackAdminIntro: 'Reba amanota n’ibitekerezo byatanzwe, ubihuze na serivisi n’ishami byahawe.',
    feedbackAdminRefresh: 'Ongera urebe',
    feedbackAdminExport: 'Kuramo CSV',
    feedbackAdminSearch: 'Shakisha igitekerezo',
    feedbackAdminSearchPlaceholder: 'Nimero y’ubusabe, serivisi, ishami cyangwa amagambo',
    feedbackAdminDepartmentFilter: 'Amashami yose',
    feedbackAdminRating: 'Amanota yose',
    feedbackAdminCount: 'Ibitekerezo byakiriwe',
    feedbackAdminAverage: 'Impuzandengo y’amanota',
    feedbackAdminLoading: 'Turimo kureba ibitekerezo…',
    feedbackAdminLoadError: 'Ntibyashobotse kuzana ibitekerezo. Ongera ugerageze.',
    outdatedFeedbackBackend: 'The backend on port 8082 is outdated and does not provide the request/feedback list API. Restart it with the latest code, then try again.',
    feedbackAdminEmpty: 'Nta bitekerezo byaratangwa.',
    feedbackAdminNoMatches: 'Nta bitekerezo bihuye n’ishakisha.',
    feedbackAdminRequest: 'Ubusabe',
    feedbackAdminService: 'Serivisi',
    feedbackAdminDepartment: 'Ishami',
    feedbackAdminRatingLabel: 'Amanota',
    feedbackAdminComment: 'Igitekerezo',
    feedbackAdminSubmitted: 'Igihe cyatangiwe',
    showFeedbackDetails: 'Reba igitekerezo',
    hideFeedbackDetails: 'Funga igitekerezo',
    feedbackAdminPrivacy: 'Iyi screen igenewe abayobozi; prototype ntirimo kwinjira kwemewe cyangwa uburenganzira bw’abakoresha.',
    portal: 'URUBUGA RWA SERIVISI Z’ABASORESHA',
    tagline: 'IMISORO MU ITERAMBERE',
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
    workspaceLabel: 'WORKSPACE',
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
    serviceSearchPlaceholder: 'Type a service name or keyword',
    noServicesMatch: 'No services match your search.',
    serviceType: 'Service requested',
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
    useRequestForFeedback: 'Use this request for feedback',
    feedbackIdHint: 'Enter the service request number shown above, not the visit number. Feedback is available after the service is completed.',
    serviceErrorAfterCheckin: (visitId) => `Check-in was recorded (visit number ${visitId}), but the service request number could not be created. Keep this visit number and contact the system administrator.`,
    missingDepartment: 'This service has not been assigned to a department. Ask the system administrator to configure it.',
    receptionNote: 'The service request number and destination department appear after check-in.',
    categoryFetchFailed: 'Available services could not be loaded. Please reload this page.',
    frontDeskTab: 'Department front desk',
    adminFeedbackTab: 'Feedback review',
    frontDeskEyebrow: 'REQUEST MANAGEMENT',
    frontDeskTitle: 'Assign requests to staff',
    frontDeskIntro: 'Review requests routed to departments, check each staff member’s current workload, then assign the request to an available colleague.',
    queueTitle: 'Taxpayer service requests',
    queueDescription: 'Search requests or filter by department to organize the work queue.',
    refreshQueue: 'Refresh',
    queueLastUpdated: (time) => `Updated: ${time}`,
    liveUpdatesConnected: 'New requests will appear as they arrive.',
    liveUpdatesDisconnected: 'Live updates are disconnected. Use Refresh to check for new requests.',
    queueLoading: 'Loading requests…',
    queueLoadError: 'Requests could not be loaded. Please try again.',
    outdatedBackend: 'The backend on port 8082 is outdated and does not provide the request list API. Restart it with the latest code, then try again.',
    queueSearchLabel: 'Search by TIN or request',
    queueSearchPlaceholder: 'Enter a TIN, request ID, service, or staff member',
    departmentFilter: 'All departments',
    allStatuses: 'All statuses',
    pendingStatus: 'Pending',
    inProgressStatus: 'In progress',
    completedStatus: 'Completed',
    openRequests: 'Open requests',
    activeRequests: 'In progress',
    completedRequests: 'Completed requests',
    requestNumber: 'Request',
    requestDetails: 'Details',
    showRequestDetails: 'View details',
    hideRequestDetails: 'Hide details',
    newArrival: 'NEW',
    incomingUnassigned: 'Taxpayers waiting for staff assignment',
    pendingAssignment: 'Received by department — assign this request to a staff member.',
    taxpayerTin: 'TIN',
    serviceLabel: 'Service',
    arrivedLabel: 'Received',
    assignedStaff: 'Assigned staff member',
    staffNamePlaceholder: 'Enter staff member name',
    staffNameHint: 'Use the workload summary above, or enter a new staff name.',
    staffLoadTitle: 'Staff workload',
    staffLoadEmpty: 'No staff members have been assigned yet.',
    activeLoad: (count) => `${count} active request${count === 1 ? '' : 's'}`,
    freeLoad: 'No active requests',
    workloadNote: 'This counts only requests assigned in this system; it cannot see other duties or staff calendars.',
    assignAndStart: 'Assign and start',
    assigning: 'Assigning…',
    assignmentSuccess: (id, name) => `Request #${id} was assigned to ${name}.`,
    noQueueMatches: 'No requests match your search.',
    noRequestsYet: 'No requests have been recorded yet. New requests will appear here.',
    statusLabel: 'Status',
    completionAction: 'Mark service completed',
    returnToQueue: 'Return to queue',
    returnReasonLabel: 'Reason not completed',
    returnReasonPlaceholder: 'For example: Taxpayer needs to bring a missing document',
    saveReturn: 'Save and return to queue',
    cancel: 'Cancel',
    reasonRequired: 'Enter a reason before returning this request to the queue.',
    completeSuccess: (id) => `Request #${id} is complete. The taxpayer can now submit feedback.`,
    returnSuccess: (id) => `Request #${id} was returned to the queue for follow-up.`,
    queuePrivacy: 'This is a prototype dashboard: staff sign-in and an approved staff directory are not connected. Use staff names confirmed by management.',
    feedbackAdminTitle: 'Taxpayer feedback review',
    feedbackAdminIntro: 'Review submitted ratings and comments, linked to their service requests and departments.',
    feedbackAdminRefresh: 'Refresh',
    feedbackAdminExport: 'Export CSV',
    feedbackAdminSearch: 'Search feedback',
    feedbackAdminSearchPlaceholder: 'Request ID, service, department, or comment',
    feedbackAdminDepartmentFilter: 'All departments',
    feedbackAdminRating: 'All ratings',
    feedbackAdminCount: 'Feedback received',
    feedbackAdminAverage: 'Average rating',
    feedbackAdminLoading: 'Loading feedback…',
    feedbackAdminLoadError: 'Feedback could not be loaded. Please try again.',
    outdatedFeedbackBackend: 'The backend on port 8082 is outdated and does not provide the request/feedback list API. Restart it with the latest code, then try again.',
    feedbackAdminEmpty: 'No feedback has been submitted yet.',
    feedbackAdminNoMatches: 'No feedback matches your search.',
    feedbackAdminRequest: 'Request',
    feedbackAdminService: 'Service',
    feedbackAdminDepartment: 'Department',
    feedbackAdminRatingLabel: 'Rating',
    feedbackAdminComment: 'Comment',
    feedbackAdminSubmitted: 'Submitted',
    showFeedbackDetails: 'View feedback',
    hideFeedbackDetails: 'Hide feedback',
    feedbackAdminPrivacy: 'This screen is intended for administrators; the prototype does not yet have authentication or user permissions.',
    portal: 'TAXPAYER SERVICE PORTAL',
    tagline: 'TAXES FOR GROWTH AND DEVELOPMENT',
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
        : response.status === 405
          ? errors.methodNotAllowed || errors.other || text.genericError
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
  const [serviceMenuOpen, setServiceMenuOpen] = useState(false)
  const [activeServiceIndex, setActiveServiceIndex] = useState(0)
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
  const [queueRequests, setQueueRequests] = useState([])
  const [expandedRequestId, setExpandedRequestId] = useState(null)
  const [newRequestIds, setNewRequestIds] = useState([])
  const knownRequestIds = useRef(null)
  const [queueLoading, setQueueLoading] = useState(false)
  const [liveUpdatesConnected, setLiveUpdatesConnected] = useState(false)
  const [queueLastUpdatedAt, setQueueLastUpdatedAt] = useState(null)
  const [queueError, setQueueError] = useState('')
  const [queueNotice, setQueueNotice] = useState('')
  const [queueSearch, setQueueSearch] = useState('')
  const [queueDepartment, setQueueDepartment] = useState('')
  const [queueStatus, setQueueStatus] = useState('')
  const [staffDrafts, setStaffDrafts] = useState({})
  const [returnRequestId, setReturnRequestId] = useState(null)
  const [returnReasons, setReturnReasons] = useState({})
  const [queueActionId, setQueueActionId] = useState(null)
  const [adminFeedback, setAdminFeedback] = useState([])
  const [expandedFeedbackId, setExpandedFeedbackId] = useState(null)
  const [adminFeedbackLoading, setAdminFeedbackLoading] = useState(false)
  const [adminFeedbackError, setAdminFeedbackError] = useState('')
  const [adminFeedbackSearch, setAdminFeedbackSearch] = useState('')
  const [adminFeedbackDepartment, setAdminFeedbackDepartment] = useState('')
  const [adminFeedbackRating, setAdminFeedbackRating] = useState('')

  const requestId = Number(serviceRequestId)
  const validRequestId =
    Number.isSafeInteger(requestId) && requestId > 0 && serviceRequestId.trim() !== ''
  const text = translations[language]
  const filteredCategories = categories.filter((category) => {
    const query = serviceSearch.trim().toLocaleLowerCase()
    if (!query) return true
    const searchableValues = [
      category.name,
      category.defaultDepartmentName || '',
      category.subUnit || '',
      ...(category.commonKeywords || []),
    ]
    return searchableValues.some((value) => value.toLocaleLowerCase().includes(query))
  })
  const queueDepartments = useMemo(
    () => [...new Set([
      ...categories.map((category) => category.defaultDepartmentName),
      ...queueRequests.map((request) => request.departmentName),
    ].filter(Boolean))].sort(),
    [categories, queueRequests],
  )
  const staffWorkload = useMemo(() => {
    const workload = new Map()
    queueRequests.forEach((request) => {
      const staffName = request.assignedStaffName?.trim()
      const departmentName = request.departmentName || ''
      if (staffName && departmentName) {
        const staffKey = `${departmentName}\u0000${staffName.toLocaleLowerCase()}`
        const existing = workload.get(staffKey)
        if (existing) {
          if (request.status === 'IN_PROGRESS') existing[2] += 1
        } else {
          workload.set(staffKey, [departmentName, staffName, request.status === 'IN_PROGRESS' ? 1 : 0])
        }
      }
    })
    return [...workload.values()].sort(
      (first, second) => first[2] - second[2] || first[1].localeCompare(second[1]),
    )
  }, [queueRequests])
  const filteredQueueRequests = queueRequests.filter((request) => {
    const query = queueSearch.trim().toLocaleLowerCase()
    const matchesQuery = !query || [
      request.id,
      request.taxpayerTin,
      request.serviceCategoryName,
      request.departmentName,
      request.assignedStaffName,
      request.reason,
    ].some((value) => String(value || '').toLocaleLowerCase().includes(query))
    return matchesQuery
      && (!queueDepartment || request.departmentName === queueDepartment)
      && (!queueStatus || request.status === queueStatus)
  })
  const inProgressCount = queueRequests.filter((request) => request.status === 'IN_PROGRESS').length
  const completedCount = queueRequests.filter((request) => request.status === 'COMPLETED').length
  const unassignedCount = queueRequests.filter(
    (request) => request.status === 'PENDING' && !request.assignedStaffName,
  ).length
  const feedbackDepartments = useMemo(
    () => [...new Set(adminFeedback.map((item) => item.departmentName).filter(Boolean))].sort(),
    [adminFeedback],
  )
  const filteredAdminFeedback = adminFeedback.filter((item) => {
    const query = adminFeedbackSearch.trim().toLocaleLowerCase()
    const matchesQuery = !query || [
      item.serviceRequestId,
      item.serviceCategoryName,
      item.departmentName,
      item.comment,
    ].some((value) => String(value || '').toLocaleLowerCase().includes(query))
    return matchesQuery
      && (!adminFeedbackDepartment || item.departmentName === adminFeedbackDepartment)
      && (!adminFeedbackRating || item.rating === Number(adminFeedbackRating))
  })
  const averageFeedbackRating = adminFeedback.length
    ? (adminFeedback.reduce((total, item) => total + item.rating, 0) / adminFeedback.length).toFixed(1)
    : '—'

  useEffect(() => {
    document.documentElement.lang = language
    const pageTitle = activeView === 'reception'
      ? text.receptionTitle
      : activeView === 'frontDesk'
        ? text.frontDeskTitle
        : activeView === 'adminFeedback'
          ? text.feedbackAdminTitle
          : text.title
    document.title = `${pageTitle} | RRA Taxpayer Services`
  }, [activeView, language, text.title, text.receptionTitle, text.frontDeskTitle, text.feedbackAdminTitle])

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

  const loadFrontDeskQueue = useCallback(async (silent = false) => {
    if (!silent) setQueueLoading(true)
    setQueueError('')
    try {
      const response = await fetch('/api/v1/service-requests')
      const requests = await readApiResponse(response, text, {
        methodNotAllowed: text.outdatedBackend,
        other: text.queueLoadError,
      })
      if (knownRequestIds.current !== null) {
        const knownIds = knownRequestIds.current
        const arrivingIds = requests
          .filter((request) => request.status === 'PENDING' && !knownIds.has(request.id))
          .map((request) => request.id)
        if (arrivingIds.length > 0) {
          setNewRequestIds((current) => [...new Set([...current, ...arrivingIds])])
        }
      }
      knownRequestIds.current = new Set(requests.map((request) => request.id))
      setQueueRequests(requests)
      setQueueLastUpdatedAt(new Date())
    } catch (error) {
      setQueueError(error instanceof Error ? error.message : text.queueLoadError)
    } finally {
      if (!silent) setQueueLoading(false)
    }
  }, [text])

  const loadAdminFeedback = useCallback(async () => {
    setAdminFeedbackLoading(true)
    setAdminFeedbackError('')
    try {
      const response = await fetch('/api/v1/feedback')
      const items = await readApiResponse(response, text, {
        methodNotAllowed: text.outdatedFeedbackBackend,
        other: text.feedbackAdminLoadError,
      })
      setAdminFeedback(items)
    } catch (error) {
      setAdminFeedbackError(error instanceof Error ? error.message : text.feedbackAdminLoadError)
    } finally {
      setAdminFeedbackLoading(false)
    }
  }, [text])

  function exportAdminFeedback() {
    const escapeCsv = (value) => `"${String(value ?? '').replaceAll('"', '""')}"`
    const rows = [
      ['Request ID', 'Service', 'Department', 'Rating', 'Comment', 'Submitted at'],
      ...filteredAdminFeedback.map((item) => [
        item.serviceRequestId,
        item.serviceCategoryName,
        item.departmentName,
        item.rating,
        item.comment,
        item.submittedAt,
      ]),
    ]
    const csv = rows.map((row) => row.map(escapeCsv).join(',')).join('\r\n')
    const file = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8' })
    const downloadUrl = URL.createObjectURL(file)
    const link = document.createElement('a')
    link.href = downloadUrl
    link.download = 'taxpayer-feedback.csv'
    link.click()
    URL.revokeObjectURL(downloadUrl)
  }

  useEffect(() => {
    if (activeView !== 'frontDesk') return undefined

    const eventSource = new EventSource('/api/v1/service-requests/events')
    eventSource.onopen = () => {
      setLiveUpdatesConnected(true)
      loadFrontDeskQueue(true)
    }
    eventSource.addEventListener('service-request-updated', () => loadFrontDeskQueue(true))
    eventSource.onerror = () => setLiveUpdatesConnected(false)

    return () => {
      eventSource.close()
      setLiveUpdatesConnected(false)
    }
  }, [activeView, loadFrontDeskQueue])

  async function assignRequest(request) {
    const staffName = (staffDrafts[request.id] || request.assignedStaffName || '').trim()
    setQueueError('')
    setQueueNotice('')
    if (!staffName) {
      setQueueError(text.staffNamePlaceholder)
      return
    }
    setQueueActionId(request.id)
    try {
      const response = await fetch(`/api/v1/service-requests/${request.id}/assignment`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ staffName }),
      })
      await readApiResponse(response, text, {
        conflict: text.queueLoadError,
        other: text.queueLoadError,
      })
      setNewRequestIds((current) => current.filter((id) => id !== request.id))
      setQueueNotice(text.assignmentSuccess(request.id, staffName))
      setStaffDrafts((current) => ({ ...current, [request.id]: staffName }))
      await loadFrontDeskQueue()
    } catch (error) {
      setQueueError(error instanceof TypeError ? text.networkError : error instanceof Error ? error.message : text.queueLoadError)
    } finally {
      setQueueActionId(null)
    }
  }

  async function recordQueueOutcome(request, status, nonCompletionReason = null) {
    setQueueError('')
    setQueueNotice('')
    if (status === 'NOT_COMPLETED' && !nonCompletionReason?.trim()) {
      setQueueError(text.reasonRequired)
      return
    }
    setQueueActionId(request.id)
    try {
      const response = await fetch(`/api/v1/service-requests/${request.id}/outcome`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, nonCompletionReason }),
      })
      await readApiResponse(response, text, {
        conflict: text.queueLoadError,
        other: text.queueLoadError,
      })
      if (status === 'COMPLETED') {
        setQueueNotice(text.completeSuccess(request.id))
      } else {
        setQueueNotice(text.returnSuccess(request.id))
        setReturnRequestId(null)
        setReturnReasons((current) => ({ ...current, [request.id]: '' }))
      }
      await loadFrontDeskQueue()
    } catch (error) {
      setQueueError(error instanceof TypeError ? text.networkError : error instanceof Error ? error.message : text.queueLoadError)
    } finally {
      setQueueActionId(null)
    }
  }

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
    setServiceMenuOpen(false)
    setActiveServiceIndex(0)
    setReason('')
    setReceptionError('')
    setCreatedTicket(null)
  }

  function selectServiceCategory(category) {
    const label = [
      category.name,
      category.defaultDepartmentName,
      category.subUnit,
    ].filter(Boolean).join(' — ')
    setSelectedCategoryId(String(category.id))
    setServiceSearch(label)
    setServiceMenuOpen(false)
    setActiveServiceIndex(0)
    setReceptionError('')
  }

  function openServicePicker() {
    if (selectedCategoryId) {
      setServiceSearch('')
      setSelectedCategoryId('')
      setActiveServiceIndex(0)
    }
    setServiceMenuOpen(true)
  }

  function useTicketForFeedback() {
    setServiceRequestId(String(createdTicket.serviceRequest.id))
    setVerifiedRequest(null)
    setRating('')
    setComment('')
    setVerificationError('')
    setSubmissionError('')
    setFeedback(null)
    setActiveView('feedback')
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
      <header className="site-header">
        <div className="masthead">
          <a className="brand" href="/" aria-label="Rwanda Revenue Authority home">
            <img className="brand-logo" src={rraLogo} alt="" />
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
      </header>

      <div className="workspace-layout">
        <aside className="workflow-sidebar">
          <p className="sidebar-label">{text.workspaceLabel}</p>
          <nav className="workflow-nav" aria-label={text.workspaceLabel}>
            <button
              className={activeView === 'reception' ? 'active' : ''}
              type="button"
              aria-current={activeView === 'reception' ? 'page' : undefined}
              onClick={() => setActiveView('reception')}
            >
              <span className="workflow-nav-icon" aria-hidden="true">01</span>
              <span>{text.receptionTab}</span>
            </button>
            <button
              className={activeView === 'frontDesk' ? 'active' : ''}
              type="button"
              aria-current={activeView === 'frontDesk' ? 'page' : undefined}
              onClick={() => {
                setActiveView('frontDesk')
                loadFrontDeskQueue()
              }}
            >
              <span className="workflow-nav-icon" aria-hidden="true">02</span>
              <span>{text.frontDeskTab}</span>
            </button>
            <button
              className={activeView === 'adminFeedback' ? 'active' : ''}
              type="button"
              aria-current={activeView === 'adminFeedback' ? 'page' : undefined}
              onClick={() => {
                setActiveView('adminFeedback')
                loadAdminFeedback()
              }}
            >
              <span className="workflow-nav-icon" aria-hidden="true">03</span>
              <span>{text.adminFeedbackTab}</span>
            </button>
            <button
              className={activeView === 'feedback' ? 'active' : ''}
              type="button"
              aria-current={activeView === 'feedback' ? 'page' : undefined}
              onClick={() => setActiveView('feedback')}
            >
              <span className="workflow-nav-icon" aria-hidden="true">04</span>
              <span>{text.feedbackTab}</span>
            </button>
          </nav>
        </aside>

      <main>
        <section className="intro" aria-labelledby="page-title">
          <div className="intro-copy">
            <p className="eyebrow">
              {activeView === 'reception'
                ? text.receptionEyebrow
                : activeView === 'frontDesk'
                  ? text.frontDeskEyebrow
                  : activeView === 'adminFeedback'
                    ? text.adminFeedbackTab.toLocaleUpperCase()
                  : text.eyebrow}
            </p>
            <h1 id="page-title">
              {activeView === 'reception'
                ? text.receptionTitle
                : activeView === 'frontDesk'
                  ? text.frontDeskTitle
                  : activeView === 'adminFeedback'
                    ? text.feedbackAdminTitle
                  : text.title}
            </h1>
            <p>{activeView === 'reception'
              ? text.receptionIntro
              : activeView === 'frontDesk'
                ? text.frontDeskIntro
                : activeView === 'adminFeedback'
                  ? text.feedbackAdminIntro
                : text.intro}</p>
          </div>
        </section>

        {activeView === 'adminFeedback' ? (
          <section className="admin-feedback" aria-label={text.feedbackAdminTitle}>
            <div className="queue-heading">
              <div>
                <p className="eyebrow">{text.adminFeedbackTab.toLocaleUpperCase()}</p>
                <h2>{text.feedbackAdminTitle}</h2>
                <p>{text.feedbackAdminIntro}</p>
              </div>
              <div className="admin-feedback-actions">
                <button
                  className="button button-quiet"
                  type="button"
                  onClick={exportAdminFeedback}
                  disabled={filteredAdminFeedback.length === 0}
                >
                  {text.feedbackAdminExport}
                </button>
                <button
                  className="button button-secondary"
                  type="button"
                  onClick={loadAdminFeedback}
                  disabled={adminFeedbackLoading}
                >
                  {adminFeedbackLoading ? text.feedbackAdminLoading : text.feedbackAdminRefresh}
                </button>
              </div>
            </div>
            <div className="queue-metrics">
              <div className="queue-metric">
                <span>{text.feedbackAdminCount}</span>
                <strong>{adminFeedback.length}</strong>
              </div>
              <div className="queue-metric">
                <span>{text.feedbackAdminAverage}</span>
                <strong>{averageFeedbackRating}<small>/5</small></strong>
              </div>
            </div>
            <div className="queue-toolbar admin-feedback-toolbar">
              <label>
                <span>{text.feedbackAdminSearch}</span>
                <input
                  type="search"
                  value={adminFeedbackSearch}
                  placeholder={text.feedbackAdminSearchPlaceholder}
                  onChange={(event) => setAdminFeedbackSearch(event.target.value)}
                />
              </label>
              <label>
                <span>{text.feedbackAdminDepartmentFilter}</span>
                <select
                  value={adminFeedbackDepartment}
                  onChange={(event) => setAdminFeedbackDepartment(event.target.value)}
                >
                  <option value="">{text.feedbackAdminDepartmentFilter}</option>
                  {feedbackDepartments.map((department) => (
                    <option key={department} value={department}>{department}</option>
                  ))}
                </select>
              </label>
              <label>
                <span>{text.feedbackAdminRating}</span>
                <select
                  value={adminFeedbackRating}
                  onChange={(event) => setAdminFeedbackRating(event.target.value)}
                >
                  <option value="">{text.feedbackAdminRating}</option>
                  {[5, 4, 3, 2, 1].map((value) => (
                    <option key={value} value={value}>{value} / 5 ★</option>
                  ))}
                </select>
              </label>
            </div>
            {adminFeedbackError && (
              <p className="error-message queue-message" role="alert">{adminFeedbackError}</p>
            )}
            {adminFeedbackLoading && adminFeedback.length === 0 ? (
              <p className="queue-empty">{text.feedbackAdminLoading}</p>
            ) : adminFeedback.length === 0 ? (
              <p className="queue-empty">{text.feedbackAdminEmpty}</p>
            ) : filteredAdminFeedback.length === 0 ? (
              <p className="queue-empty">{text.feedbackAdminNoMatches}</p>
            ) : (
              <div className="request-table-scroll">
                <table className="request-table feedback-review-table">
                  <thead>
                    <tr>
                      <th scope="col">{text.feedbackAdminRequest}</th>
                      <th scope="col">{text.feedbackAdminService}</th>
                      <th scope="col">{text.feedbackAdminDepartment}</th>
                      <th scope="col">{text.feedbackAdminSubmitted}</th>
                      <th scope="col">{text.feedbackAdminRatingLabel}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAdminFeedback.map((item) => {
                      const isExpanded = expandedFeedbackId === item.id
                      const submittedAt = item.submittedAt
                        ? new Date(item.submittedAt).toLocaleString(language === 'rw' ? 'rw-RW' : 'en-RW')
                        : '—'
                      return (
                        <Fragment key={item.id}>
                          <tr
                            className={`request-table-row${isExpanded ? ' expanded' : ''}`}
                            tabIndex={0}
                            aria-expanded={isExpanded}
                            aria-label={`${text.feedbackAdminRequest} ${item.serviceRequestId}: ${item.rating}/5`}
                            onClick={() => setExpandedFeedbackId(isExpanded ? null : item.id)}
                            onKeyDown={(event) => {
                              if (event.key === 'Enter' || event.key === ' ') {
                                event.preventDefault()
                                setExpandedFeedbackId(isExpanded ? null : item.id)
                              }
                            }}
                          >
                            <td>
                              <span className="table-request-number">#{item.serviceRequestId}</span>
                            </td>
                            <td className="table-service-name">{item.serviceCategoryName}</td>
                            <td>{item.departmentName}</td>
                            <td>{submittedAt}</td>
                            <td>
                              <span className="feedback-rating" aria-label={`${item.rating} / 5`}>
                                <span aria-hidden="true">{'★'.repeat(item.rating)}{'☆'.repeat(5 - item.rating)}</span>
                                <strong>{item.rating}/5</strong>
                              </span>
                            </td>
                          </tr>
                          {isExpanded && (
                            <tr className="request-detail-row" key={`${item.id}-details`}>
                              <td colSpan="5">
                                <div className="request-detail-panel feedback-detail-panel">
                                  <div className="request-card-details">
                                    <div>
                                      <span>{text.feedbackAdminRequest}</span>
                                      <strong>#{item.serviceRequestId}</strong>
                                    </div>
                                    <div>
                                      <span>{text.feedbackAdminService}</span>
                                      <strong>{item.serviceCategoryName}</strong>
                                    </div>
                                    <div>
                                      <span>{text.feedbackAdminDepartment}</span>
                                      <strong>{item.departmentName}</strong>
                                    </div>
                                    <div>
                                      <span>{text.feedbackAdminSubmitted}</span>
                                      <strong>{submittedAt}</strong>
                                    </div>
                                    <div>
                                      <span>{text.feedbackAdminRatingLabel}</span>
                                      <strong>{item.rating}/5</strong>
                                    </div>
                                  </div>
                                  <div className="admin-feedback-comment">
                                    <span>{text.feedbackAdminComment}</span>
                                    <p>{item.comment || '—'}</p>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                        </Fragment>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        ) : activeView !== 'feedback' ? (
          <section
            className={activeView === 'frontDesk' ? 'front-desk-shell' : 'feedback-card reception-card'}
            aria-label={activeView === 'frontDesk' ? text.frontDeskTitle : text.receptionTitle}
          >
            {activeView !== 'frontDesk' && createdTicket ? (
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
                <p className="field-hint">{text.feedbackIdHint}</p>
                <button className="button button-secondary" type="button" onClick={useTicketForFeedback}>
                  {text.useRequestForFeedback}
                </button>
                <button className="button button-primary" type="button" onClick={startAnotherCheckIn}>
                  {text.nextTaxpayer}
                </button>
              </div>
            ) : activeView === 'frontDesk' ? (
              <section className="front-desk" aria-label={text.frontDeskTitle}>
                <div className="queue-heading">
                  <div>
                    <p className="eyebrow">{text.frontDeskEyebrow}</p>
                    <h2>{text.queueTitle}</h2>
                    <p>{text.queueDescription}</p>
                    <p className={`queue-auto-refresh${liveUpdatesConnected ? ' connected' : ' disconnected'}`}>
                      {liveUpdatesConnected ? text.liveUpdatesConnected : text.liveUpdatesDisconnected}
                      {queueLastUpdatedAt && (
                        <> {text.queueLastUpdated(queueLastUpdatedAt.toLocaleTimeString(language === 'rw' ? 'rw-RW' : 'en-RW'))}</>
                      )}
                    </p>
                  </div>
                  <button
                    className="button button-secondary"
                    type="button"
                    onClick={loadFrontDeskQueue}
                    disabled={queueLoading}
                  >
                    {queueLoading ? text.queueLoading : text.refreshQueue}
                  </button>
                </div>

                <div className="queue-metrics" aria-label={text.queueTitle}>
                  <div className="queue-metric">
                    <span>{text.incomingUnassigned}</span>
                    <strong>{unassignedCount}</strong>
                  </div>
                  <div className="queue-metric">
                    <span>{text.activeRequests}</span>
                    <strong>{inProgressCount}</strong>
                  </div>
                  <div className="queue-metric">
                    <span>{text.completedRequests}</span>
                    <strong>{completedCount}</strong>
                  </div>
                </div>

                <div className="queue-toolbar">
                  <label className="queue-search">
                    <span>{text.queueSearchLabel}</span>
                    <input
                      type="search"
                      value={queueSearch}
                      placeholder={text.queueSearchPlaceholder}
                      onChange={(event) => setQueueSearch(event.target.value)}
                    />
                  </label>
                  <label className="queue-select">
                    <span>{text.departmentFilter}</span>
                    <select value={queueDepartment} onChange={(event) => setQueueDepartment(event.target.value)}>
                      <option value="">{text.departmentFilter}</option>
                      {queueDepartments.map((department) => (
                        <option key={department} value={department}>{department}</option>
                      ))}
                    </select>
                  </label>
                  <label className="queue-select">
                    <span>{text.statusLabel}</span>
                    <select value={queueStatus} onChange={(event) => setQueueStatus(event.target.value)}>
                      <option value="">{text.allStatuses}</option>
                      <option value="PENDING">{text.pendingStatus}</option>
                      <option value="IN_PROGRESS">{text.inProgressStatus}</option>
                      <option value="COMPLETED">{text.completedStatus}</option>
                    </select>
                  </label>
                </div>

                {queueError && <p className="error-message queue-message" role="alert">{queueError}</p>}
                {queueNotice && <p className="success-message queue-message" role="status">{queueNotice}</p>}

                <section className="staff-workload" aria-labelledby="staff-workload-title">
                  <div className="staff-workload-heading">
                    <h3 id="staff-workload-title">{text.staffLoadTitle}</h3>
                    <p>{text.workloadNote}</p>
                  </div>
                  {staffWorkload.length > 0 ? (
                    <div className="staff-load-list">
                      {staffWorkload
                        .filter(([departmentName]) => !queueDepartment || departmentName === queueDepartment)
                        .map(([departmentName, staffName, count]) => (
                        <div className={`staff-load-item${count === 0 ? ' available' : ''}`} key={`${departmentName}-${staffName}`}>
                          <span className="staff-avatar" aria-hidden="true">{staffName.slice(0, 1).toLocaleUpperCase()}</span>
                          <span className="staff-load-name">
                            {staffName}{queueDepartment ? '' : ` · ${departmentName}`}
                          </span>
                          <span className="staff-load-count">{count === 0 ? text.freeLoad : text.activeLoad(count)}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="staff-empty">{text.staffLoadEmpty}</p>
                  )}
                </section>

                <div className="request-queue" aria-live="polite">
                  {queueLoading && queueRequests.length === 0 ? (
                    <p className="queue-empty">{text.queueLoading}</p>
                  ) : queueError && queueRequests.length === 0 ? null : queueRequests.length === 0 ? (
                    <p className="queue-empty">{text.noRequestsYet}</p>
                  ) : filteredQueueRequests.length === 0 ? (
                    <p className="queue-empty">{text.noQueueMatches}</p>
                  ) : (
                    <div className="request-table-scroll">
                      <table className="request-table">
                        <thead>
                          <tr>
                            <th scope="col">{text.requestNumber}</th>
                            <th scope="col">{text.serviceLabel}</th>
                            <th scope="col">{text.departmentFilter}</th>
                            <th scope="col">{text.taxpayerTin}</th>
                            <th scope="col">{text.arrivedLabel}</th>
                            <th scope="col">{text.statusLabel}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredQueueRequests.map((request) => {
                    const staffName = request.assignedStaffName || ''
                    const statusLabel = request.status === 'PENDING'
                      ? text.pendingStatus
                      : request.status === 'IN_PROGRESS'
                        ? text.inProgressStatus
                        : request.status === 'COMPLETED'
                          ? text.completedStatus
                          : request.status
                    const isExpanded = expandedRequestId === request.id
                    return (
                      <Fragment key={request.id}>
                          <tr
                            className={`request-table-row${isExpanded ? ' expanded' : ''}`}
                            tabIndex={0}
                            aria-expanded={isExpanded}
                            aria-label={`${text.requestNumber} ${request.id}: ${request.serviceCategoryName}`}
                            onClick={() => setExpandedRequestId(isExpanded ? null : request.id)}
                            onKeyDown={(event) => {
                              if (event.key === 'Enter' || event.key === ' ') {
                                event.preventDefault()
                                setExpandedRequestId(isExpanded ? null : request.id)
                              }
                            }}
                          >
                            <td>
                              <span className="table-request-number">
                                #{request.id}
                                {newRequestIds.includes(request.id) && request.status === 'PENDING' && (
                                  <span className="new-arrival-badge">{text.newArrival}</span>
                                )}
                              </span>
                            </td>
                            <td className="table-service-name">{request.serviceCategoryName}</td>
                            <td>{request.departmentName}</td>
                            <td>{request.taxpayerTin || '—'}</td>
                            <td>{request.createdAt
                              ? new Date(request.createdAt).toLocaleString(language === 'rw' ? 'rw-RW' : 'en-RW')
                              : '—'}</td>
                            <td>
                              <span className={`request-status status-${String(request.status).toLowerCase().replaceAll('_', '-')}`}>
                                {statusLabel}
                              </span>
                            </td>
                          </tr>
                          {isExpanded && (
                            <tr className="request-detail-row" key={`${request.id}-details`}>
                              <td colSpan="6">
                                <div className="request-detail-panel">
                                  <div className="request-card-details">
                                    <div>
                                      <span>{text.requestNumber}</span>
                                      <strong>#{request.id}</strong>
                                    </div>
                                    <div>
                                      <span>{text.serviceLabel}</span>
                                      <strong>{request.serviceCategoryName}</strong>
                                    </div>
                                    <div>
                                      <span>{text.departmentFilter}</span>
                                      <strong>{request.departmentName}</strong>
                                    </div>
                                    <div>
                                      <span>{text.taxpayerTin}</span>
                                      <strong>{request.taxpayerTin || '—'}</strong>
                                    </div>
                                    <div>
                                      <span>{text.arrivedLabel}</span>
                                      <strong>{request.createdAt
                                        ? new Date(request.createdAt).toLocaleString(language === 'rw' ? 'rw-RW' : 'en-RW')
                                        : '—'}</strong>
                                    </div>
                                    <div>
                                      <span>{text.statusLabel}</span>
                                      <strong>{statusLabel}</strong>
                                    </div>
                                  </div>
                                  {request.status === 'PENDING' && !request.assignedStaffName && (
                                    <p className="pending-assignment-notice">{text.pendingAssignment}</p>
                                  )}
                                  {request.reason && <p className="request-reason">{request.reason}</p>}
                                  {request.nonCompletionReason && (
                                    <p className="request-follow-up"><strong>{text.returnReasonLabel}:</strong> {request.nonCompletionReason}</p>
                                  )}
                                  <div className="request-assignment">
                            <label htmlFor={`staff-${request.id}`}>{text.assignedStaff}</label>
                            <div className="assignment-row">
                            <input
                              id={`staff-${request.id}`}
                              type="text"
                              maxLength="120"
                              list={`available-staff-${request.id}`}
                              value={staffDrafts[request.id] ?? staffName}
                              placeholder={text.staffNamePlaceholder}
                              onChange={(event) => setStaffDrafts((current) => ({
                                ...current,
                                [request.id]: event.target.value,
                              }))}
                              disabled={request.status === 'COMPLETED'}
                            />
                            <datalist id={`available-staff-${request.id}`}>
                              {staffWorkload
                                .filter(([departmentName]) => departmentName === request.departmentName)
                                .map(([departmentName, name, count]) => (
                                  <option key={`${departmentName}-${name}`} value={name} label={text.activeLoad(count)} />
                                ))}
                            </datalist>
                            {(request.status === 'PENDING' || request.status === 'IN_PROGRESS') && (
                              <button
                                className="button button-secondary"
                                type="button"
                                onClick={() => assignRequest(request)}
                                disabled={queueActionId === request.id}
                              >
                                {queueActionId === request.id ? text.assigning : text.assignAndStart}
                              </button>
                            )}
                          </div>
                          <p className="field-hint">{text.staffNameHint}</p>
                          {request.status === 'IN_PROGRESS' && staffName && (
                            <p className="assignment-workload">
                              {text.assignedStaff}: <strong>{staffName}</strong> · {
                                text.activeLoad(staffWorkload.find(
                                  ([departmentName, name]) => departmentName === request.departmentName && name === staffName,
                                )?.[2] || 0)
                              }
                            </p>
                          )}
                        </div>
                        {request.status === 'IN_PROGRESS' && (
                          <div className="request-actions">
                            <button
                              className="button button-primary"
                              type="button"
                              onClick={() => recordQueueOutcome(request, 'COMPLETED')}
                              disabled={queueActionId === request.id}
                            >
                              {text.completionAction}
                            </button>
                            {returnRequestId === request.id ? (
                              <div className="return-request-form">
                                <label htmlFor={`return-reason-${request.id}`}>{text.returnReasonLabel}</label>
                                <textarea
                                  id={`return-reason-${request.id}`}
                                  rows="2"
                                  maxLength="1000"
                                  value={returnReasons[request.id] || ''}
                                  placeholder={text.returnReasonPlaceholder}
                                  onChange={(event) => setReturnReasons((current) => ({
                                    ...current,
                                    [request.id]: event.target.value,
                                  }))}
                                />
                                <div className="return-request-actions">
                                  <button
                                    className="button button-secondary"
                                    type="button"
                                    onClick={() => recordQueueOutcome(request, 'NOT_COMPLETED', returnReasons[request.id])}
                                    disabled={queueActionId === request.id}
                                  >
                                    {text.saveReturn}
                                  </button>
                                  <button
                                    className="button button-quiet"
                                    type="button"
                                    onClick={() => setReturnRequestId(null)}
                                  >
                                    {text.cancel}
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <button
                                className="button button-quiet"
                                type="button"
                                onClick={() => setReturnRequestId(request.id)}
                              >
                                {text.returnToQueue}
                              </button>
                            )}
                          </div>
                        )}
                              </div>
                            </td>
                          </tr>
                        )}
                      </Fragment>
                    )
                  })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </section>
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
                    <label htmlFor="service-search">{text.serviceType}</label>
                    <div className="service-picker">
                      <input
                        id="service-search"
                        type="search"
                        placeholder={categoriesLoading ? text.categoriesLoading : text.serviceSearchPlaceholder}
                        value={serviceSearch}
                        onChange={(event) => {
                          setServiceSearch(event.target.value)
                          setSelectedCategoryId('')
                          setActiveServiceIndex(0)
                          setServiceMenuOpen(true)
                          setReceptionError('')
                        }}
                        onFocus={openServicePicker}
                        onClick={openServicePicker}
                        onBlur={() => setServiceMenuOpen(false)}
                        onKeyDown={(event) => {
                          if (event.key === 'ArrowDown' && filteredCategories.length > 0) {
                            event.preventDefault()
                            setServiceMenuOpen(true)
                            setActiveServiceIndex((index) => Math.min(index + 1, filteredCategories.length - 1))
                          } else if (event.key === 'ArrowUp' && filteredCategories.length > 0) {
                            event.preventDefault()
                            setServiceMenuOpen(true)
                            setActiveServiceIndex((index) => Math.max(index - 1, 0))
                          } else if (event.key === 'Enter' && serviceMenuOpen && filteredCategories.length > 0) {
                            event.preventDefault()
                            const category = filteredCategories[Math.min(activeServiceIndex, filteredCategories.length - 1)]
                            selectServiceCategory(category)
                          } else if (event.key === 'Escape') {
                            setServiceMenuOpen(false)
                          }
                        }}
                        disabled={categoriesLoading || categoriesLoadFailed}
                        autoComplete="off"
                        role="combobox"
                        aria-autocomplete="list"
                        aria-expanded={serviceMenuOpen && filteredCategories.length > 0}
                        aria-controls="service-category-options"
                        aria-activedescendant={
                          serviceMenuOpen && filteredCategories.length > 0
                            ? `service-option-${filteredCategories[Math.min(activeServiceIndex, filteredCategories.length - 1)].id}`
                            : undefined
                        }
                        aria-invalid={Boolean(receptionError && !selectedCategoryId)}
                        required
                      />
                      {serviceMenuOpen && filteredCategories.length > 0 && (
                        <ul className="service-options" id="service-category-options" role="listbox">
                          {filteredCategories.map((category, index) => (
                            <li key={category.id}>
                              <button
                                id={`service-option-${category.id}`}
                                className={index === activeServiceIndex ? 'active' : ''}
                                type="button"
                                role="option"
                                aria-selected={String(category.id) === selectedCategoryId}
                                disabled={!category.defaultDepartmentId || !category.defaultDepartmentName}
                                onMouseDown={(event) => event.preventDefault()}
                                onMouseEnter={() => setActiveServiceIndex(index)}
                                onClick={() => selectServiceCategory(category)}
                              >
                                <strong>{category.name}</strong>
                                <span>
                                  {category.defaultDepartmentName || text.missingDepartment}
                                  {category.subUnit ? ` · ${category.subUnit}` : ''}
                                </span>
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
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
                    {!categoriesLoadFailed && !categoriesLoading && categories.length > 0 && !selectedCategoryId && filteredCategories.length === 0 && (
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
                <p className="field-hint">{text.feedbackIdHint}</p>
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
          {activeView === 'reception'
            ? text.receptionNote
            : activeView === 'frontDesk'
              ? text.queuePrivacy
              : activeView === 'adminFeedback'
                ? text.feedbackAdminPrivacy
              : text.privacy}
        </p>

      <footer className="site-footer">
        <span>{text.footer}</span>
        <span>{text.footerSystem}</span>
      </footer>
      </main>
      </div>
    </div>
  )
}

export default App
