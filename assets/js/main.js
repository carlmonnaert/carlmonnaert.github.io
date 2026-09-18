document.addEventListener('DOMContentLoaded', async () => {
    const username = 'carlmonnaert';
    const projectList = document.getElementById('project-list');
    const loadingMessage = document.getElementById('loading-message');

    try {
        const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`);
        
        if (!response.ok) {
            if (response.status === 403) {
                throw new Error("GitHub API rate limit exceeded. Please wait an hour and refresh.");
            }
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const repos = await response.json();

        if (loadingMessage) {
            loadingMessage.remove();
        }

        const filteredRepos = repos.filter(repo => !repo.fork && repo.name !== `${username}.github.io`);

        if (filteredRepos.length === 0) {
            projectList.innerHTML = '<p>No public projects found.</p>';
            return;
        }

        filteredRepos.forEach(repo => {
            const article = document.createElement('article');
            article.className = 'project';

            const date = new Date(repo.created_at).getFullYear();
            const titleName = repo.name || 'Untitled';
            const title = titleName.replace(/-/g, ' ').replace(/(^\w|\s\w)/g, m => m.toUpperCase());

            const techStack = [];
            if (repo.language) techStack.push(repo.language);
            if (repo.topics && Array.isArray(repo.topics)) {
                techStack.push(...repo.topics);
            }

            const techStackHTML = techStack.length > 0 
                ? `<ul class="tech-stack">${techStack.map(tech => `<li>${tech}</li>`).join('')}</ul>`
                : '';

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
        console.error("Fetch error details:", error);
        if (projectList) {
            // Replaces the "Fetching..." text with the actual error so you aren't left guessing
            projectList.innerHTML = `<p style="color: #d9534f;"><b>System Error:</b> ${error.message} <br><br> Please visit my <a href="https://github.com/carlmonnaert">GitHub profile</a> directly.</p>`;
        }
    }
});
