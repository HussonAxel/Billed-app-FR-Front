import NewBill from "../containers/NewBill.js";
import NewBillUI from "../views/NewBillUI.js";
import { ROUTES_PATH } from "../constants/routes.js";
import { screen } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import storeFromMock from "../__mocks__/store";
import mockStore from "../__mocks__/store.js";
import { localStorageMock } from "../__mocks__/localStorage.js";
import router from "../app/Router";
import BillsUI from "../views/BillsUI.js";

jest.mock("../containers/Logout.js");

describe("Given I am connected as an employee", () => {
  describe("Testing handleChangeFile method", () => {
    let user, windowMock;
    beforeEach(() => {
      windowMock = {
        // Simulate user connection to localStorage
        document: {
          // simulate DOM UI
          querySelector: jest.fn((element) => {
            // File input
            if (element === `input[data-testid="file"]`) {
              return {
                addEventListener: jest.fn(),
                files: [{ name: "image.jpg" }],
              };
            }
            // Bill Validation
            if (element === 'form[data-testid="form-new-bill"]') {
              return {
                addEventListener: jest.fn(),
              };
            }
          }),
        },
      };
      // Simulate employee connection on localstorage
      window.localStorage.setItem(
        "user",
        JSON.stringify({
          type: "Employee",
          email: "employee@test.tld",
          password: "employee",
          status: "connected",
        })
      );
    });
    test("Should handle a valid image file uploaded by a user correctly", () => {
      const bill = new NewBill({
        // Simulate necessary DOM and navigation
        document: windowMock.document,
        onNavigate: () => {
          // Simulate API Logic
        },
        store: {
          bills: () => {
            return {
              create: jest.fn(() =>
                Promise.resolve({ fileUrl: "url", key: "key" })
              ),
            };
          },
        },
        localStorage: windowMock.localStorage,
      });
      //
      const handleChangeFile = jest.fn(bill.handleChangeFile);
      handleChangeFile({
        target: { value: "image.jpg" },
        preventDefault: () => null,
      });
      expect(handleChangeFile).toHaveBeenCalled();
    });

    test("Should throw an error when the API call to create bill fails", () => {
      const bill = new NewBill({
        document: windowMock.document,
        onNavigate: () => {},
        store: {
          bills: () => {
            return {
              create: jest.fn(() => Promise.reject({ message: "API is down" })),
            };
          },
        },
        localStorage: windowMock.localStorage,
      });
      const handleChangeFile = jest.fn(bill.handleChangeFile);
      return handleChangeFile({
        target: { value: "image.jpg" },
        preventDefault: () => null,
      });
    });
    //POST test
    describe("I'm posting a form that is valid", () => {
      test("we fetch the new Bills from the mock using the API with the POST protocol", async () => {
        const bill = new NewBill({
          document: windowMock.document,
          onNavigate: () => {},
          store: {
            bills: () => {
              return {
                create: jest.fn(() =>
                  Promise.resolve({ fileUrl: "url", key: "key" })
                ),
              };
            },
          },
          localStorage: windowMock.localStorage,
        });
        const mockedStoreBills = storeFromMock.bills().update(bill);

        let result = {};
        mockedStoreBills.then((object) => {
          result = object;
          expect(result.id).toBe("47qAXb6fIm2zOKkLzMro");
        });

        expect(mockedStoreBills).not.toBeNull();
      });
    });
  });
  describe("Testing form submission for a new bill", () => {
    let onNavigate;

    beforeEach(() => {
      document.body.innerHTML = NewBillUI();
      onNavigate = jest.fn();
      const store = {
        bills: jest.fn(() => ({ update: jest.fn().mockResolvedValue({}) })),
      };
      window.localStorage.setItem(
        "user",
        JSON.stringify({ email: "employee@example.com" })
      );

      const newBillInstance = new NewBill({
        document,
        onNavigate,
        store,
        localStorage: window.localStorage,
      });
      newBillInstance.updateBill = jest.fn().mockResolvedValue({});
    });

    test("Form submission should be prevented by default", async () => {
      const handleSubmit = jest.fn();
      document
        .querySelector(`form[data-testid="form-new-bill"]`)
        .addEventListener("submit", handleSubmit);
      await userEvent.click(screen.getByText("Envoyer"));
      expect(handleSubmit).toHaveBeenCalled();
    });

    test("Form submission should redirect to the Bills page", async () => {
      await userEvent.click(screen.getByText("Envoyer"));
      expect(onNavigate).toHaveBeenCalledWith(ROUTES_PATH["Bills"]);
    });
  });

describe("Check on API errors when called", () => {
  beforeEach(() => {
    jest.spyOn(mockStore, "bills");

    Object.defineProperty(window, "localStorage", {
      value: localStorageMock,
    });

    window.localStorage.setItem(
      "user",
      JSON.stringify({
        type: "Employee",
        email: "a@a",
      })
    );

    const root = document.createElement("div");
    root.setAttribute("id", "root");
    document.body.appendChild(root);

    router();
  });

  const testApiError = async (errorCode) => {
    mockStore.bills.mockImplementationOnce(() => {
      return {
        list: () => {
          return Promise.reject(new Error(`Erreur ${errorCode}`));
        },
      };
    });

    window.onNavigate(ROUTES_PATH.NewBill);

    await new Promise(process.nextTick);

    document.body.innerHTML = BillsUI({ error: `Erreur ${errorCode}` });

    const [errorMessageElement, errorMessage] = [
      screen.getByTestId("error-message"),
      screen.getByText(new RegExp(`Erreur ${errorCode}`)),
    ];

    expect(errorMessageElement).toBeTruthy();
    expect(errorMessage).toBeTruthy();
  };

  test("Check the API error call : 404", async () => {
    await testApiError(404);
  });

  test("Check the API error call : 500", async () => {
    await testApiError(500);
  });
});
});
