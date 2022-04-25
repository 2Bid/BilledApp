/**
 * @jest-environment jsdom
 */

import { screen, waitFor, fireEvent } from "@testing-library/dom";
import { ROUTES, ROUTES_PATH } from "../constants/routes.js";
import NewBillUI from "../views/NewBillUI.js";
import { localStorageMock } from "../__mocks__/localStorage.js";
import mockStore from "../__mocks__/store"
import router from '../app/Router.js'
import NewBill from "../containers/NewBill.js";
import userEvent from "@testing-library/user-event";

jest.mock("../app/store", () => mockStore)

describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("Then input file should be required and respect condition", async () => {
      document.body.innerHTML = NewBillUI();
      Object.defineProperty(window, "localStorage", {
        value: localStorageMock,
      });
      window.localStorage.setItem(
        "user",
        JSON.stringify({
          type: "Employee",
        })
      );
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname });
      };
      const handleChangeMock = jest.fn();
      const layoutDisconnectMock = jest.fn();
      const JqueryMock = jest.fn(() => {
        return {
          handleChangeFile: handleChangeMock,
          click: layoutDisconnectMock,
        };
      });
      Object.defineProperty(window, "$", { value: JqueryMock });
      const newBill = new NewBill({
        document: document,
        onNavigate: onNavigate,
        store: mockStore,
        localStorage: localStorageMock,
      });

      //mettre ca dans le test d'integration ?
      await waitFor(() => screen.getByTestId("file"));
      const inputFile = screen.getByTestId("file");
      expect(inputFile).toBeTruthy();
      //

      fireEvent.change(screen.getByTestId('file'), {
        target: {
          files: [new File(['(⌐□_□)'], 'chucknorris.pdf', {type: 'text/pdf'})],
        },
      })
      const inputFileErrorMsg = screen.getByTestId('msg-file-error')
      expect(inputFileErrorMsg).toBeTruthy()
      expect(inputFileErrorMsg.classList.contains('active')).toBeTruthy()

      fireEvent.change(screen.getByTestId('file'), {
        target: {
          files: [new File(['(⌐□_□)'], 'chucknorris.png', {type: 'image/png'})],
        },
      })
    });

    test("Then the form should can be submit succesfully", () => {
      document.body.innerHTML = NewBillUI();
      //to-do write assertion
      Object.defineProperty(window, "localStorage", {
        value: localStorageMock,
      });
      window.localStorage.setItem(
        "user",
        JSON.stringify({
          email: "test@jest.com",
        })
      );
      const updateBillMock = jest.fn();
      const onNavigateMock = jest.fn();
      const newBill = new NewBill({
        document: document,
        onNavigate: onNavigateMock,
        store: mockStore,
        localStorage: localStorageMock
      });
      newBill.updateBill = updateBillMock
      const date = screen.getByTestId('datepicker')
      const prix = screen.getByTestId('amount')
      const tvaPct = screen.getByTestId('pct')
      date.value = '22/08/1998'
      prix.value = '20'
      tvaPct.value = '10'
      const btnSubmit = screen.getByText('Envoyer')
      userEvent.click(btnSubmit)
      expect(onNavigateMock).toHaveBeenCalled()
    });
  });
});

// test d'intégration POST
describe("Given I am a user connected as Employee", () => {
  describe("When I want to create a New Bill", () => {
    beforeEach(() => {
      jest.spyOn(mockStore, "bills")
    })
    test("I want to be redirect on the right page", async () => {
      localStorage.setItem("user", JSON.stringify({ type: "Employee", email: "a@a" }));
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.NewBill)
      const newBill = await waitFor(() => screen.getAllByText("Envoyer une note de frais"))
      expect(newBill).toBeTruthy()
    })

    test("Check if error console appear", async () => {
      document.body.innerHTML = NewBillUI();
      //to-do write assertion
      Object.defineProperty(window, "localStorage", {
        value: localStorageMock,
      });
      window.localStorage.setItem(
        "user",
        JSON.stringify({
          email: "test@jest.com",
        })
      );
      const onNavigateMock = jest.fn();
      const consoleUpdateBillMock = jest.fn()
      console.error = consoleUpdateBillMock
      mockStore.bills.mockImplementationOnce(() => {
        return {
          update : () =>  {
            return Promise.resolve()
          }
        }
      })
      const newBill = new NewBill({
        document: document,
        onNavigate: onNavigateMock,
        store: mockStore,
        localStorage: localStorageMock
      });
      const date = screen.getByTestId('datepicker')
      const prix = screen.getByTestId('amount')
      const tvaPct = screen.getByTestId('pct')
      date.value = '22/08/1998'
      prix.value = '20'
      tvaPct.value = '10'
      const btnSubmit = screen.getByText('Envoyer')
      userEvent.click(btnSubmit)
      await new Promise((r) => setTimeout(r, 2000));
      expect(consoleUpdateBillMock).not.toHaveBeenCalled()
    });

    test("Check if", async () => {
      document.body.innerHTML = NewBillUI();
      //to-do write assertion
      Object.defineProperty(window, "localStorage", {
        value: localStorageMock,
      });
      window.localStorage.setItem(
        "user",
        JSON.stringify({
          email: "test@jest.com",
        })
      );
      const onNavigateMock = jest.fn();
      const consoleUpdateBillMock = jest.fn()
      console.error = consoleUpdateBillMock
      mockStore.bills.mockImplementationOnce(() => {
        return {
          update : () =>  {
            return Promise.reject()
          }
        }
      })
      const newBill = new NewBill({
        document: document,
        onNavigate: onNavigateMock,
        store: mockStore,
        localStorage: localStorageMock
      });
      const date = screen.getByTestId('datepicker')
      const prix = screen.getByTestId('amount')
      const tvaPct = screen.getByTestId('pct')
      date.value = '22/08/1998'
      prix.value = '20'
      tvaPct.value = '10'
      const btnSubmit = screen.getByText('Envoyer')
      userEvent.click(btnSubmit)
      await new Promise((r) => setTimeout(r, 2000));
      expect(consoleUpdateBillMock).toHaveBeenCalled()
    });
  })
})
