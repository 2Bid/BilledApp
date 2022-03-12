/**
 * @jest-environment jsdom
 */

 import {screen, waitFor, fireEvent} from "@testing-library/dom"
import userEvent from '@testing-library/user-event'
 import BillsUI from "../views/BillsUI.js"
 import { bills } from "../fixtures/bills.js"
 import {ROUTES, ROUTES_PATH} from "../constants/routes.js";
 import {localStorageMock} from "../__mocks__/localStorage.js";
 
 import router from "../app/Router.js";
import NewBillUI from "../views/NewBillUI.js";
import BillsContainer from '../containers/Bills';
import storeMock from '../__mocks__/store'
 
 describe("Given I am connected as an employee", () => {
   describe("When I am on Bills Page", () => {
     test("Then bill icon in vertical layout should be highlighted", async () => {
   
       Object.defineProperty(window, 'localStorage', { value: localStorageMock })
       window.localStorage.setItem('user', JSON.stringify({
         type: 'Employee'
       }))
       const root = document.createElement("div")
       root.setAttribute("id", "root")
       document.body.append(root)
       router()
       window.onNavigate(ROUTES_PATH.Bills)
       await waitFor(() => screen.getByTestId('icon-window'))
       const windowIcon = screen.getByTestId('icon-window')
       //to-do write expect expression
       expect(windowIcon.classList.contains('active-icon')).toBeTruthy();
 
     })
     test("Then bills should be ordered from earliest to latest", () => {
       document.body.innerHTML = BillsUI({ data: bills })
       const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
       const antiChrono = (a, b) => ((a < b) ? 1 : -1)
       const datesSorted = [...dates].sort(antiChrono)
       expect(dates).toEqual(datesSorted)
     })
     test('Verifie la creation d une nouvelle note de frais', () => {
       document.body.innerHTML = BillsUI({data : bills})
       const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
       const billsContainer = new BillsContainer({document:document, onNavigate:onNavigate, store:storeMock, localStorage:localStorageMock})
       const buttonNewBill = screen.getByTestId('btn-new-bill');
       userEvent.click(buttonNewBill)
       const formNewBill = screen.getByTestId('form-new-bill')
       expect(formNewBill).toBeTruthy()
 })
 test('Verifie le justificatif au click', () => {
  document.body.innerHTML = BillsUI({data : bills})
  const onNavigate = (pathname) => {
   document.body.innerHTML = ROUTES({ pathname })
 }
 const widthMock = jest.fn()
 const htmlMock = jest.fn()
 const findMock = jest.fn(()=>{
   return { html : htmlMock }
 })
 const layoutDisconnectMock = jest.fn()
 const modalMock = jest.fn()
 const JqueryMock = jest.fn(()=>{
   return { width : widthMock, find : findMock, modal : modalMock, click : layoutDisconnectMock }
 })
 Object.defineProperty(window, '$', { value: JqueryMock })
  const billsContainer = new BillsContainer({document:document, onNavigate:onNavigate, store:storeMock, localStorage:localStorageMock})
  const iconsEye = screen.getAllByTestId('icon-eye');
  const iconEye = iconsEye[0]
  userEvent.click(iconEye)
  expect(modalMock).toHaveBeenCalled()
})
})})