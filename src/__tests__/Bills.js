/**
 * @jest-environment jsdom
 */

import {
    screen,
    waitFor,
} from "@testing-library/dom";
import BillsUI from "../views/BillsUI.js";
import {bills} from "../fixtures/bills.js";
import {ROUTES_PATH} from "../constants/routes.js";
import Bills from "../containers/Bills";
import {localStorageMock} from "../__mocks__/localStorage.js";
import mockStore from "../__mocks__/store";

import router from "../app/Router.js";

jest.mock("../app/store", () => mockStore);
describe("Given I am connected as an employee", () => {
    const setUserType = (type, email) => {
        const user = JSON.stringify({type: type, email: email});
        localStorage.setItem("user", user);
    };

    const createRootElement = (id) => {
        const root = document.createElement("div");
        root.setAttribute("id", id);
        document.body.append(root);
    };
    describe("When I am on Bills Page", () => {
        test("Then bill icon in vertical layout should be highlighted", async () => {
            Object.defineProperty(window, "localStorage", {
                value: localStorageMock,
            });
            window.localStorage.setItem(
                "user",
                JSON.stringify({
                    type: "Employee",
                })
            );
            const root = document.createElement("div");
            root.setAttribute("id", "root");
            document.body.append(root);
            router();
            window.onNavigate(ROUTES_PATH.Bills);
            await waitFor(() => screen.getByTestId("icon-window"));
            const windowIcon = screen.getByTestId("icon-window");
            expect(windowIcon.classList.contains("active-icon")).toBeTruthy();
        });
    test("Then bills should be ordered from earliest to latest", () => {
      document.body.innerHTML = BillsUI({ data: bills });
      const dates = screen
        .getAllByText(
          /^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i
        )
        .map((a) => a.innerHTML);
      const antiChrono = (a, b) => (a < b ? 1 : -1);
      const datesSorted = [...dates].sort(antiChrono);
      expect(dates).toEqual(datesSorted);
    });
    });

    test('handleClickIconEye is called when the icon is clicked', () => {
        const bill = new Bills({ document: document, onNavigate: jest.fn(), store: mockStore });
        const mockIcon = document.createElement('div');
        mockIcon.setAttribute('data-bill-url', 'mockBillUrl');
        bill.handleClickIconEye = jest.fn();
        window.$.fn.modal = jest.fn();
        mockIcon.addEventListener('click', () => bill.handleClickIconEye(mockIcon));
        mockIcon.dispatchEvent(new MouseEvent('click', { bubbles: true }));

        expect(bill.handleClickIconEye).toHaveBeenCalledWith(mockIcon);
    });


    test('handleClickIconEye shows modal', () => {
        const bill = new Bills({ document: document, onNavigate: jest.fn(), store: mockStore });
        const mockIcon = document.createElement('div');
        mockIcon.setAttribute('data-bill-url', 'mockBillUrl');
        window.$.fn.modal = jest.fn();
        bill.handleClickIconEye(mockIcon);

        expect(window.$.fn.modal).toHaveBeenCalledWith('show');
    });

    test("Check the handleClickNewBill function", () => {
        const mockFn = jest.fn();
        const bill = new Bills({document, onNavigate: mockFn});
        bill.handleClickNewBill();
        expect(mockFn).toHaveBeenCalled();
    });
    test("fetches bills from the mock API using GET", async () => {
        setUserType("Employee", "a@a");
        createRootElement("root");
        router();
        window.onNavigate(ROUTES_PATH.Bills);
        const buttonNewBill = screen.getByTestId("btn-new-bill");
        expect(buttonNewBill).toBeTruthy();
    });

    describe("When an error occurs to the API", () => {
        beforeEach(() => {
            jest.spyOn(mockStore, "bills");
            Object.defineProperty(window, "localStorage", {
                value: localStorageMock,
            });
            window.localStorage.setItem(
                "user",
                JSON.stringify({
                    type: "Admin",
                    email: "a@a",
                })
            );
            const root = document.createElement("div");
            root.setAttribute("id", "root");
            document.body.appendChild(root);
            router();
        });
        const testErrorMessage = async (errorMessage) => {
            mockStore.bills.mockImplementationOnce(() => {
                return {
                    list: () => {
                        return Promise.reject(new Error(errorMessage));
                    },
                };
            });
            window.onNavigate(ROUTES_PATH.Bills);
            await new Promise(process.nextTick);
            const message = await screen.getByText(new RegExp(errorMessage));
            expect(message).toBeTruthy();
        };

        test("fetches bills from an API and fails with 404 message error", async () => {
            await testErrorMessage("Erreur 404");
        });
        test("fetches messages from an API and fails with 500 message error", async () => {
            await testErrorMessage("Erreur 500");
        });
    });
});
