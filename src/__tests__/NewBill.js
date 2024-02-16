import NewBill from "../containers/NewBill.js";
import { screen } from "@testing-library/dom";
import NewBillUI from "../views/NewBillUI.js";

jest.mock("../containers/Logout.js");

describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    beforeEach(() => {
      document.body.innerHTML = NewBillUI();
    });

    test("Then it should instantiate NewBill with the correct properties and event listeners", () => {
      const onNavigate = jest.fn();
      const store = { bills: jest.fn(() => ({ create: jest.fn().mockResolvedValue({}) })) };
      const localStorage = window.localStorage;

      const spyQuerySelector = jest.spyOn(document, 'querySelector');

      const addEventListenerMock = jest.fn();
      spyQuerySelector.mockReturnValueOnce({ addEventListener: addEventListenerMock }); // for form
      spyQuerySelector.mockReturnValueOnce({ addEventListener: addEventListenerMock }); // for file input

      const newBill = new NewBill({
        document,
        onNavigate,
        store,
        localStorage
      });

      expect(addEventListenerMock).toHaveBeenCalledTimes(2);
      expect(addEventListenerMock).toHaveBeenNthCalledWith(1, "submit", expect.any(Function));
      expect(addEventListenerMock).toHaveBeenNthCalledWith(2, "change", expect.any(Function));

      spyQuerySelector.mockRestore();
    });
  });
});
