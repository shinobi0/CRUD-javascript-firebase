$(() => {

	

	// Récupération des profils des utilisateurs
	// Affichage en boucle des cards contenant les utilisateurs
	firebase.database().ref('users').on('value', (snapshot) => {
		console.log(snapshot.val());
		snapshot.forEach((childSnapshot) => {
			const childKey = childSnapshot.key;
			const childData = childSnapshot.val();

			let card = document.createElement('div');
			card.setAttribute('class', 'card bg-dark cursor-pointer');
			$('#cardContainer').append(card);
			card.onclick = function () {
				document.location = './portfolio.html?userId=' + childKey;
			}

			let cardHeader = document.createElement('div');
			cardHeader.setAttribute('class', 'card-header');
			card.append(cardHeader);

			let avatar = document.createElement('img');
			avatar.setAttribute('class', 'w-100');
			avatar.src = childData.profileImg ? childData.profileImg : 'assets/img/myAvatar.png';
			avatar.setAttribute('alt', 'Photo de ' + childData.firstname + ' ' + childData.lastname);
			cardHeader.append(avatar);

			let cardContent = document.createElement('div');
			cardContent.setAttribute('class', 'card-content');
			card.append(cardContent);

			let devName = document.createElement('h2');
			devName.setAttribute('class', 'font-courier text-yellow');
			devName.append(childData.firstname + ' ' + childData.lastname);
			cardContent.append(devName);

			let job = document.createElement('h3');
			job.append(childData.job);
			cardContent.append(job);

		});

		// loader
		const loaderContainer = document.getElementById('loaderContainer');
		loaderContainer.setAttribute('class', 'd-none');
		

	});

});