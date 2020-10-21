$(() => { // Initialisation du DOM

	const signUpSubmit = $('#signUpSubmit'); // Bouton soumission formulaire inscription

	signUpSubmit.click(() => { // Soumission du formulaire
		console.log('Form submitted');

		const profileImg = $('#signUpProfileImg').val(); // TODO Traitement
		const lastname = $('#signUpLastname').val();
		const firstname = $('#signUpFirstname').val();
		const city = $('#signUpCity').val();
		const zip = $('#signUpZip').val();
		const email = $('#signUpEmail').val();
		const password = $('#signUpPassword').val();
		const phone = $('#signUpPhone').val();
		const resume = $('#signUpResume').val();
		const job = $('#signUpJob').val();
		const description = $('#signUpDescription').val();

		const contractTypes = $('input[name="signUpContractType"]:checked');
		let selectedContractTypes = [];
		contractTypes.each((index) => {
			selectedContractTypes.push(contractTypes[index].value);
		});

		const skills = $('input[name=signUpSkills]:checked');
		let selectedSkills = [];
		skills.each((index) => {
			selectedSkills.push(skills[index].value);
		});

		const websiteUrl = $('#signUpWebsiteUrl').val();
		const linkedInUrl = $('#signUpLinkedInUrl').val();
		const facebookUrl = $('#signUpFacebookUrl').val();

		const newUser = { // Objet JSON du nouvel utilisateur
			lastname: lastname, // clé: valeur
			firstname: firstname,
			email: email,
			city: city,
			zip: zip,
			phone: phone,
			job: job,
			description: description,
			selectedContractTypes: selectedContractTypes,
			selectedSkills: selectedSkills,
			websiteUrl: websiteUrl,
			linkedInUrl: linkedInUrl,
			facebookUrl: facebookUrl
		};

		// Création de l'utilisateur avec email et mot de passe
		firebase.auth().createUserWithEmailAndPassword(email, password)
		.then((data) => { // réponse de firebase (si tout s'est bien passé)
			console.log(data.user.uid); // user id
			// Ajout des données de l'utilisateur (objet newUser) dans la database
			firebase.database().ref('users/' + data.user.uid).set(newUser)
			.then((data) => {
				console.log(data);
				document.location = './portfolio.html';
			}).catch((error) => {
				console.error(error.code, error.message);
			});
		})
		.catch(function(error) { // cas d'erreur
		  // Handle Errors here.
		  var errorCode = error.code;
		  var errorMessage = error.message;
		  alert(errorCode + ' : ' + errorMessage);
		});

	});

	// fonction de connexion
	const signInSubmit = $('#signInSubmit');

	signInSubmit.click(() => {

		const email = $('#signInEmail').val();
		const password = $('#signInPassword').val();

		firebase.auth().signInWithEmailAndPassword(email, password)
		.then((data) => {
			console.log(data);
			document.location = './portfolio.html';
		})
		.catch((error) => {
			console.error(error.code, error.message);
		});

	});

	// fonction de déconnexion
	const signOutBtn = $('.signOutBtn');

	signOutBtn.click(() => {
		firebase.auth().signOut().catch((error) => {
			console.error(error.code, error.message);
		});
		document.location = './index.html';
	});

	// Affichage conditionnel des boutons "Connexion", "Inscription", "Déconnexion", "Mon compte"
	// Selon l'état de connexion de l'utilisateur
	firebase.auth().onAuthStateChanged((user) => {
		if (user) {
			$('.signInBtn').attr('class', 'd-none');
			$('.signUpBtn').attr('class', 'd-none');
			$('.signOutBtn').attr('class', 'd-block');
			$('.accountBtn').attr('class', 'd-block');
		} else {
			$('.signInBtn').attr('class', 'd-block');
			$('.signUpBtn').attr('class', 'd-block');
			$('.signOutBtn').attr('class', 'd-none');
			$('.accountBtn').attr('class', 'd-none');
		}
	});

	// fonction de mot de passe oublié
	const forgottenPassword = document.getElementById('forgottenPassword');
	if (forgottenPassword !== null) {
		forgottenPassword.onclick = function() {
		const email = prompt('Entrez votre addresse email pour réinitialiser votre mot de passe');
		firebase.auth().sendPasswordResetEmail(email).then(
			() => {
				alert('Vérifiez votre boite mail');
			}).catch(
			(error) => {
				alert(error.code + ' : ' + error.message);
			});
		}
	}

});