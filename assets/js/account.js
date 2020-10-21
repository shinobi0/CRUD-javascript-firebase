let userPhotoUrl = "assets/img/profil.png"; // lien de la photo de profil de l'utilisateur connecté
let currentUser; // data du user connecté
let userResumeUrl = "#"; // lien du CV de l'utilisateur connecté

$(() => {

	let userId; // id de l'utilisateur connecté
	let userSession; // session de l'utilisateur connecté

	// Vérification de l'état de connexion de l'utilisateur
	// Récupération de la session et des data du user
	firebase.auth().onAuthStateChanged((user) => {
		if (user) {

			userSession = user;
			userId = user.uid;
			firebase.database().ref('users/' + userId).once('value')
			.then((data) => {

				//console.log(data.val());
				currentUser = data.val();
				//pour le premier chargement de page currentUser est vide
				if(currentUser){
					if (currentUser.profileImg && currentUser.profileImg !== '') {
						document.getElementById('profileImg').setAttribute('src', currentUser.profileImg);
					}else{
						document.getElementById('profileImg').setAttribute('src', 'assets/img/profil.png');					
					}

					if (currentUser.resume && currentUser.resume !== '') {
						document.getElementById('seeResumeBtn').setAttribute('href', currentUser.resume);
					}

					userResumeUrl = currentUser.resume;
					userPhotoUrl = currentUser.profileImg;

					// Affectation de valeurs récupérées aux champs du formulaire
					$('#accountLastname').val(currentUser.lastname);
					$('#accountFirstname').val(currentUser.firstname);
					$('#accountCity').val(currentUser.city);
					$('#accountZip').val(currentUser.zip);
					$('#accountEmail').val(currentUser.email);
					$('#accountPhone').val(currentUser.phone);
					$('#accountJob').val(currentUser.job);
					$('#accountDescription').val(currentUser.description);
					$('#accountWebsiteUrl').val(currentUser.websiteUrl);
					$('#accountLinkedInUrl').val(currentUser.linkedInUrl);
					$('#accountFacebookUrl').val(currentUser.facebookUrl);

					// Affectation des types de contrats cochés
					if (currentUser.selectedContractTypes && currentUser.selectedContractTypes.length > 0) {
						const contractTypes = $('input[name=accountContractType]');
						contractTypes.each((index, element) => {
							if (currentUser.selectedContractTypes.includes(contractTypes[index].value)) {
								element.setAttribute('checked', '');
							}
						});
					}

					// Affectation des compétences cochées
					if (currentUser.selectedSkills && currentUser.selectedSkills.length > 0) {
						const skills = $('input[name=accountSkills]');
						skills.each((index, element) => {
							if (currentUser.selectedSkills.includes(skills[index].value)) {
								element.setAttribute('checked', '');
							}
						});
					}
				}


			})
			.catch((error) => {
				console.error(error.code, error.message);
			});

		} else {
			console.log('No user connected');
		}
	});

	// Envoi de la photo de profil donnée par l'utilisateur
	const profileImgInput = $('#accountProfileImg');
	profileImgInput.change(() => {
		let profileImg = document.getElementById('accountProfileImg').files[0];
		console.log(profileImg);
		uploadPhoto(profileImg);
	});

	// Envoi du CV donné par l'utilisateur
	const profileResumeInput = $('#accountResume');
	profileResumeInput.change(() => {
		let profileResume = document.getElementById('accountResume').files[0];
		uploadResume(profileResume);
	});

	// Fonction de sauvegarde du compte au clique du bouton saveAccountBtn
	const saveAccountBtn = $('#saveAccountBtn');

	//Si vous relacher (keyUp) la touche entrée vous simuler un click sur le bouton enregistrer
	document.addEventListener("keyup", function(event) {
	  if (event.keyCode === 13) {
	   event.preventDefault();
	   document.getElementById("saveAccountBtn").click();
	  }
	});
	saveAccountBtn.click(() => {

		// Récupération de toutes les valeurs renseignées par l'utilisateur
		const profileImg = userPhotoUrl ? userPhotoUrl : currentUser.profileImg;
		const resume = userResumeUrl ? userResumeUrl : currentUser.resume;

		console.log(profileImg);
		console.log(resume);

		const lastname = $('#accountLastname').val();
		const firstname = $('#accountFirstname').val();
		const city = $('#accountCity').val();
		const zip = $('#accountZip').val();
		const phone = $('#accountPhone').val();
		const job = $('#accountJob').val();
		const description = $('#accountDescription').val();
		const websiteUrl = $('#accountWebsiteUrl').val();
		const linkedInUrl = $('#accountLinkedInUrl').val();
		const facebookUrl = $('#accountFacebookUrl').val();
		const email = $('#accountEmail').val();

		const contractTypes = $('input[name="accountContractType"]:checked');
		let selectedContractTypes = [];
		contractTypes.each((index) => {
			selectedContractTypes.push(contractTypes[index].value);
		});

		const skills = $('input[name=accountSkills]:checked');
		let selectedSkills = [];
		skills.each((index) => {
			selectedSkills.push(skills[index].value);
		});

		const newUser = { // Objet JSON du nouvel utilisateur/utilisateur modifié
			profileImg: profileImg,
			resume: resume,
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

		console.log(newUser);

		// modification de l'email en session
		if (newUser.email == "") {
			newUser.email = userSession.email;
		}
		else if (userSession.email !== newUser.email) {
			userSession.updateEmail(newUser.email).then(() => {
			  console.log('Update successful.');
			}).catch((error) => {
			  console.error(error.code, error.message);
			});
		}else{
			newUser.email = userSession.email;
		}
		// Mise à jour des data du user
		firebase.database().ref('users/' + userId).update(newUser).catch(
			(error) => {
				console.error(error.code, error.message);
			});

	});

	// Suppresion du compte au clique du bouton removeAccountBtn
	$('#removeAccountBtn').click(() => {

		if (confirm("Êtes-vous sûr de supprimer votre compte ?")) {
			
			// suppression du CV et de la photo de profil dans le storage
			if (currentUser.resume) {
				removeFile(currentUser.resume);
			}
			if (currentUser.profileImg) {
				removeFile(currentUser.profileImg);
			}
			// suppression des data et de la session de l'utilisateur
			firebase.database().ref('users/' + userId).remove();
			userSession.delete().then(function() {
			  console.log("User deleted.")
			}).catch(function(error) {
			  console.error(error);
			});

		} else {
			console.log("Ouf !");
		}

	});

});

// fonction d'upload de la photo de profil dans le storage
function uploadPhoto(file) {
	const almostUniqueId = Date.now().toString();
    const upload = firebase.storage().ref()
    .child('images/users/' + almostUniqueId + file.name).put(file);
    upload.on(firebase.storage.TaskEvent.STATE_CHANGED,
    	() => { // En attente (chargement...)
          console.log('Loading...');
        },
        (error) => { // Cas d'erreur
          console.log('Error ! : ' + error);
        },
        () => { // Réponse finale (fichier chargé)
		upload.snapshot.ref.getDownloadURL().then(function(downloadURL) {
			console.log(downloadURL);
			document.getElementById('profileImg').src = downloadURL;
			if (currentUser.profileImg && currentUser.profileImg !== '') {
				removeFile(currentUser.profileImg);
			}
			userPhotoUrl = downloadURL;
    	});
		}
	);
}

// fonction d'upload du CV dans le storage
function uploadResume(file) {
	const almostUniqueId = Date.now().toString();
    const upload = firebase.storage().ref()
    .child('resumes/' + almostUniqueId + file.name).put(file);
    upload.on(firebase.storage.TaskEvent.STATE_CHANGED,
    	() => {
          console.log('Loading...');
        },
        (error) => {
          console.log('Error ! : ' + error);
        },
        () => {
		upload.snapshot.ref.getDownloadURL().then(function(downloadURL) {
			console.log(downloadURL);
			if (currentUser.resume && currentUser.resume !== '') {
				removeFile(currentUser.resume);
			}
			userResumeUrl = downloadURL;
    	});
		}
	);
}

// fonction de suppression d'un fichier dans le storage grâce à son lien de téléchargement
function removeFile(fileLink) {
	if(fileLink == "assets/img/profil.png"){
		return
	}
 	else if (fileLink) {
    const storageRef = firebase.storage().refFromURL(fileLink);
    storageRef.delete().then(
      () => {
        console.log('File deleted');
      }
    ).catch(
      (error) => {
        console.log('File not found : ' + error);
      }
    );
  }
}
