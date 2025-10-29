describe("authentification test", () => {
	it("connect as an admin", () => {
		cy.loginAs("ADMIN");
	}),
	it("connect as a teacher", () => {
		cy.loginAs("TEACHER");
	}),
	it("connect as a student", () => {
	  cy.loginAs("STUDENT");
	}),
	it("connect as a manager", () => {
		cy.loginAs("MANAGER");
	});
	it("connect as a monitor", ()=>{
		cy.loginAs("MONITOR")
	})
});
