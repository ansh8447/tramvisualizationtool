# Visualization Tool Dashboard
This dashboard tool is being created for supporting the Power Systems. 

### Project Features 
- Frontend : Bootstrap
- Backend : Python Flask 
- Database : PostgreSQL + sqlAlchemy(ORM) 
- Maps : Leaflet.js 
- Charts : Plotly.js  
- Tables : Datatables.js 
- API calls : Jquery AJAX
- API Architecture : REST

**Note: For security reasons, database file is not provided in this update**

## How to run the application?

1. Open pgAdmin. 
This would open up a webpage, enter the Database password and press Enter. 
On the left panel, expand Servers, expand databases, expand tramdb to connect. 

2. Open visual studio code and open the TRAM folder present on desktop. 
(File-> open folder -> TRAM)

3. On the left panel of the VS code, expand tramproject

4. Right click on the app.py file and click open in integrated terminal

5. In the VS code terminal run the following commands - 
	cd venv
	cd Scipts
	Activate.ps1
	Press enter
This would activate your virtual environment
Now come back to the orignal folder using following.. 
cd ../..

6. Now run the following command 
	python .\app.py
   Now the server has started. 

7. Go to http://127.0.0.1/5000

Your application is up and running. 

Note: To close the application, just come back to VS code and in the terminal 
click (ctrl + c) . This would stop the server and then you can simply close the browser window
And then you can close the tab for PostgreSql Database as well. 

Thanks!
