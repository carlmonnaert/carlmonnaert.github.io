document.addEventListener('DOMContentLoaded', async () => {
    const username = 'carlmonnaert';
    const projectList = document.getElementById('project-list');
    const loadingMessage = document.getElementById('loading-message');

    try {
        const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const repos = await response.json();

        if (loadingMessage) {
            loadingMessage.remove();
        }

        const filteredRepos = repos.filter(repo => !repo.fork && repo.name !== `${username}.github.io`);

        filteredRepos.forEach(repo => {
            const article = document.createElement('article');
            article.className = 'project';

            const date = new Date(repo.created_at).getFullYear();
            const title = repo.name.replace(/-/g, ' ').replace(/(^\w|\s\w)/g, m => m.toUpperCase());

            const techStack = [];
            if (repo.language) techStack.push(repo.language);
            if (repo.topics && repo.topics.length > 0) {
                techStack.push(...repo.topics);
            }

            const techStackHTML = techStack.length > 0 
                ? `<ul class="tech-stack">${techStack.map(tech => `<li>${tech}</li>`).join('')}</ul>`
                : '';

            // Generate GitHub and GitHub Pages links
            let linksHTML = `<a href="${repo.html_url}" target="_blank">Repository</a>`;
            if (repo.has_pages) {
                linksHTML += ` <span class="separator">/</span> <a href="https://${username}.github.io/${repo.name}/" target="_blank">Live Demo</a>`;
            }

            article.innerHTML = `
                <h2>${title}</h2>
                <span class="date">${date}</span>
                <p>${repo.description ? repo.description : 'No description provided.'}</p>
                <div class="project-links">${linksHTML}</div>
                ${techStackHTML}
            `;

            projectList.appendChild(article);
        });

    } catch (error) {
        console.error("Failed to fetch GitHub projects:", error);
        projectList.innerHTML = '<p>Unable to load projects at this time. Please visit my <a href="https://github.com/carlmonnaert">GitHub profile</a> directly.</p>';
    }
});
