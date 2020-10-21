//alert('page non chargée!')
window.onload = ()=> {
//alert('page chargée!')
	let url = new URL(document.location.href); // récupération URL courante
	let uid = url.searchParams.get("userId"); // récupération du paramètre userId dans l'URL
	if (uid === null) { // si userId est null, rediriger vers index.html
		document.location = './index.html';
	}
	let userData;

	// Requête à firebase pour récupérer les infos d'un utilisateur d'après son ID
	firebase.database().ref('/users/' + uid).once('value')
	.then((snapshot) => {
		userData = snapshot.val();

		// Lien du bouton CV
		const resumeLink = document.getElementById('resumeLink');
		resumeLink.href = userData.resume ? userData.resume : '#';

		//cible le span name pour le nom sur le document HTML
		const nom = document.getElementById('name');

		//Ecrit le nom et prenom dans l'element html
		nom.innerHTML = userData.lastname.toUpperCase() + ' ' + userData.firstname;

		const contract = document.getElementById('contract');

		const lis = userData.selectedContractTypes.join(', ');
		contract.innerHTML = "";
		contract.append(lis);

		//cible le span description  pour le nom sur le document HTML
		const description = document.getElementById('description');

		//Ecrit la description dans l'element html
		description.innerHTML = userData.description;

		//cible le span description  pour le nom sur le document HTML
		const address = document.getElementById('address');
		// address.innerHTML = userData.address;

		//Ecrit la description dans l'element html
		description.innerHTML = userData.description;

		const zipCode = document.getElementById('zipCode');
		zipCode.innerHTML = userData.zip;

		const town = document.getElementById('town');
		town.innerHTML = userData.city;

		const phone = document.getElementById('phone');
		phone.innerHTML = userData.phone;

		if (userData.selectedSkills) {
			// si le tableau de compétences n'est PAS vide
			if (userData.selectedSkills.length > 0) {
				// Boucle : Pour chaque compétence ajoute la compétence à la liste skillsList
				userData.selectedSkills.forEach((skill) => {
					// Vérifie chaque cas où la compétence est égale à l'une des chaînes de caractères ci-dessous
					switch (skill) { // Affiche l'image en fonction de la compétence
						case 'HTML/CSS':
							document.getElementById('htmlImg').setAttribute('class', 'd-block');
						break;
						case 'Javascript':
							document.getElementById('jsImg').setAttribute('class', 'd-block');
						break;
						case 'PHP':
							document.getElementById('phpImg').setAttribute('class', 'd-block');
						break;
						case 'MySQL':
							document.getElementById('mysqlImg').setAttribute('class', 'd-block');
						break;
						default:
						console.log('ok');
					}
				});

			}
		}

		// Gestion des liens de contact et réseaux sociaux

		const facebookLink = document.getElementById('facebookLink');
		if (userData.facebookUrl && userData.facebookUrl !== '') {
			facebookLink.href = userData.facebookUrl;
			facebookLink.setAttribute('class', 'd-block');
		}

		const profileLink = document.getElementById('profile-link');
		if (userData.linkedInUrl && userData.linkedInUrl !== '') {
			profileLink.href = userData.linkedInUrl;
			profileLink.setAttribute('class', 'd-block');
		}

		const twitterLink = document.getElementById('twitterLink');
		if (userData.twitterUrl && userData.twitterUrl !== '') {
			twitterLink.href = userData.twitterUrl;
			twitterLink.setAttribute('class', 'd-block');
		}

		const emailLink = document.getElementById('emailLink');
		emailLink.href = 'mailto:' + userData.email;
		emailLink.setAttribute('class', 'd-block');

		const phoneLink = document.getElementById('phoneLink');
		if (userData.phone && userData.phone !== '') {
			phoneLink.href = 'tel:' + userData.phone;
			phoneLink.setAttribute('class', 'd-block');
		}

		const websiteLink = document.getElementById('websiteLink');
		if (userData.websiteUrl && userData.websiteUrl !== '') {
			websiteLink.href = userData.websiteUrl;
			websiteLink.setAttribute('class', 'd-block');
		}

		const profilePict = document.getElementById('photoProfile');
		profilePict.src = userData.profileImg ? userData.profileImg : 'assets/img/myAvatar.png';

		// Création de la balise h3
		let contractsTitle = document.createElement("h3");
		// Applique les mots 'Contrats souhaités' au titre h3
		contractsTitle.append('Contrats souhaités');
		// Implémentation de la balise h3 dans le main


		// Création de la balise ul pour la liste des contrats
		let contractsList = document.createElement("ul");
		if (userData.selectedContractTypes) {
			// si le tableau de contrats n'est PAS vide
			if (userData.selectedContractTypes.length > 0) {
				 // Implémentation de la balise ul dans le main
			}

			// Boucle : Pour chaque compétence ajoute la compétence à la liste skillsList
			userData.selectedContractTypes.forEach((contract) => {
				console.log(contract);
				let contractElement = document.createElement("li");
				contractElement.append(contract);
				contractsList.append(contractElement);
			});
		}

		// loader
		const loaderContainer = document.getElementById('loaderContainer');
		loaderContainer.setAttribute('class', 'd-none');
	})
	.catch((error) => {
		console.error(error.code, error.message);
	});

};