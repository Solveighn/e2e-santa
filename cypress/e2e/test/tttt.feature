Feature: user can create a box and run it

    Scenario: userAutor logins and create a box
        Given userAutor is on secretSanta login page
        When user logs in as "lisenysh1@yandex.ru" and "123456" and creates a box
        Then a box is created

    Scenario: userAutor create invite link
        Given userAutor is on box page
        When userAutor adds participants and saves invite link
        Then users get invite link

    Scenario: approve as another user
        Given another user is on secretSanta login page
        When another user logs in as "<email>" and "<password>" and create a card
        Then another user added as participant
        Examples:
            | email                     | password |
            | lisenysh1+test1@yandex.ru | 123456   |
            | lisenysh1+test2@yandex.ru | 123456   |
            | lisenysh1+test3@yandex.ru | 123456   |

    Scenario: make toss successfully
        Given userAutor logs on secretSanta login page as "lisenysh1@yandex.ru" and "123456"
        When userAutor goes to box page and makes toss
        Then toss completed successfully