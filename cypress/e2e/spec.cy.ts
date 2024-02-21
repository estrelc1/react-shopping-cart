  describe('Shopping Cart Functionality', () => {
    beforeEach(() => {
      cy.visit('http://localhost:3000'); // Update URL as needed
      cy.clearCookies();
    });

    it('Test Case 1: Verify that items can be added to the cart', () => {
      // list of item title to be added to cart
      const items: string[]= ["Cropped Stay Groovy off white"];
      items.map((item) => {
        cy.get('p').contains(item).parent().find('button').click();
        // verify that clicking on add to cart open the cart section.
        cy.get('.Cart__Container-sc-1h98xa9-1').should('be.visible');
        // verify that the after adding item to cart increase the number in cart icon
        cy.get('.Cart__Container-sc-1h98xa9-1').get('div.Cart__CartQuantity-sc-1h98xa9-3').should('have.text', items.indexOf(item) + 1);
        // verify that after adding item in card lists the cart in the cart content section
        cy.get('.Cart__Container-sc-1h98xa9-1').get('p.CartProduct__Title-sc-11uohgb-2').contains(item).should('be.visible');
        cy.get('button').contains('X').click();
      })

    });

    it('Test Case 2: Verify that the total price is calculated correctly after each item added to cart', () => {
      const items: string[] = ["Cropped Stay Groovy off white", "Basic Cactus White T-shirt"];
      let totalPrice = 0;
      items.map((item) => {
        let itemNumber = items.indexOf(item) + 1
        cy.get('p').contains(item).parent().find('button').click();
        cy.get('.Cart__Container-sc-1h98xa9-1').should('be.visible');
        cy.get('.Cart__Container-sc-1h98xa9-1').get('div.Cart__CartQuantity-sc-1h98xa9-3').should('have.text', itemNumber);
        cy.get(`.CartProducts__Container-sc-7th5t8-0 > div:nth-child(${itemNumber}) div.CartProduct__Price-sc-11uohgb-4 p`).invoke('text').then((value) => {

          // Verify that the total price is calculated correctly
          totalPrice = totalPrice + parseFloat(value.replace('$', ''))
          cy.get('.Cart__SubPriceValue-sc-1h98xa9-9').should('contain', `$ ${totalPrice}`);

        })
        cy.get('.Cart__Container-sc-1h98xa9-1').get('p.CartProduct__Title-sc-11uohgb-2').contains(item).should('be.visible');
        cy.get('button').contains('X').click();
      });
    });

    it('Test Case 3: Verify that the checkout process completes successfully', () => {
      const items: string[] = ["Cropped Stay Groovy off white"];
      items.map((item) => {
        cy.get('p').contains(item).parent().find('button').click();
        cy.get('.Cart__Container-sc-1h98xa9-1').should('be.visible');
        cy.get('.Cart__Container-sc-1h98xa9-1').get('div.Cart__CartQuantity-sc-1h98xa9-3').should('have.text', items.indexOf(item) + 1);
        cy.get('.Cart__Container-sc-1h98xa9-1').get('p.CartProduct__Title-sc-11uohgb-2').contains(item).should('be.visible');
        cy.get('button').contains('X').click();

        // Verify that clicking on the CHECKOUT button should 
        cy.get('.Cart__CartIcon-sc-1h98xa9-2').click();
        cy.get('.Cart__Container-sc-1h98xa9-1').should('be.visible');
        cy.get('button').contains('Checkout').should('be.visible').click();

        // verify that windows alert is displayed.
        cy.on('window:alert', (text) => {
          expect(text).to.contain('Checkout - Subtotal'); 
        });
      })
    });

    it('Test Case 4: Verify that cart should be blank at first visit', () => {
      cy.get('.Cart__Container-sc-1h98xa9-1').get('div.Cart__CartQuantity-sc-1h98xa9-3').should('have.text', 0);
      cy.get('.Cart__CartIcon-sc-1h98xa9-2').click();
        cy.get('.Cart__Container-sc-1h98xa9-1').should('be.visible');
      cy.get('p').contains('Add some products in the cart ').should('be.visible');
      cy.get('.Cart__SubPriceValue-sc-1h98xa9-9').should('contain', `$ 0.00`);
      
    })
  });

  
