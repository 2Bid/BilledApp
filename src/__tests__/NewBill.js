/**
 * @jest-environment jsdom
 */

import { screen, waitFor, fireEvent } from "@testing-library/dom";
import { ROUTES, ROUTES_PATH } from "../constants/routes.js";
import NewBillUI from "../views/NewBillUI.js";
import { localStorageMock } from "../__mocks__/localStorage.js";
import mockStore from "../__mocks__/store";

import NewBill from "../containers/NewBill.js";

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
      //mettre ca dans le test d'integration ?
      await waitFor(() => screen.getByTestId("file"));
      const inputFile = screen.getByTestId("file");
      expect(inputFile).toBeTruthy();

      const handleChangeMock = jest.fn();
      const fileUrlMock = jest.fn();
      const fileNameMock = jest.fn();
      const billIdMock = jest.fn();
      const layoutDisconnectMock = jest.fn();
      const JqueryMock = jest.fn(() => {
        return {
          handleChangeFile: handleChangeMock,
          click: layoutDisconnectMock,
          fileUrl: fileUrlMock,
          fileName: fileNameMock,
          billId: billIdMock,
        };
      });
      Object.defineProperty(window, "$", { value: JqueryMock });
      const newBill = new NewBill({
        document: document,
        onNavigate: onNavigate,
        store: mockStore,
        localStorage: localStorageMock,
        fileUrl: fileUrlMock,
        fileName: fileNameMock,
        billId: billIdMock,
      });
      fireEvent.change(inputFile,{
        target : {files : [new File()]}
      })
    });

    test("Then the form should can be submit succesfully", () => {
      document.body.innerHTML = NewBillUI();
      //to-do write assertion
    });
  });
});
