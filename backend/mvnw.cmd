@REM ----------------------------------------------------------------------------
@REM Licensed to the Apache Software Foundation (ASF) under one
@REM or more contributor license agreements.  See the NOTICE file
@REM distributed with this work for additional information
@REM regarding copyright ownership.  The ASF licenses this file
@REM to you under the Apache License, Version 2.0 (the
@REM "License"); you may not use this file except in compliance
@REM with the License.  You may obtain a copy of the License at
@REM
@REM    http://www.apache.org/licenses/LICENSE-2.0
@REM
@REM Unless required by applicable law or agreed to in writing,
@REM software distributed under the License is distributed on an
@REM "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
@REM KIND, either express or implied.  See the License for the
@REM specific language governing permissions and limitations
@REM under the License.
@REM ----------------------------------------------------------------------------

@REM ----------------------------------------------------------------------------
@REM Maven Start Up Batch script
@REM
@REM Required ENV vars:
@REM JAVA_HOME - location of a JDK home dir
@REM
@REM Optional ENV vars
@REM MAVEN_BATCH_ECHO - set to 'on' to enable the echoing of the batch commands
@REM MAVEN_BATCH_PAUSE - set to 'on' to wait for a keystroke before ending
@REM MAVEN_OPTS - parameters passed to the Java VM when running Maven
@REM     e.g. to debug Maven itself, use
@REM set MAVEN_OPTS=-Xdebug -Xrunjdwp:transport=dt_socket,server=y,suspend=y,address=8000
@REM MAVEN_SKIP_RC - flag to disable loading of mavenrc files
@REM ----------------------------------------------------------------------------

@echo off
@setlocal

set ERROR_CODE=0

@REM To isolate internal variables from possible serverhealth scripts, use a unique prefix
set "WRAPPER_JAR=%~dp0.mvn\wrapper\maven-wrapper.jar"
set "WRAPPER_PROPERTIES=%~dp0.mvn\wrapper\maven-wrapper.properties"
set "MW_MAVEN_HOME=%~dp0.mvn\wrapper\maven"

@REM Find the project root
set "MAVEN_PROJECT_ROOT=%~dp0"
:findRoot
if exist "%MAVEN_PROJECT_ROOT%\.mvn" goto foundRoot
set "MAVEN_PROJECT_ROOT=%MAVEN_PROJECT_ROOT%..\"
if "%MAVEN_PROJECT_ROOT%"=="..\" goto foundRoot
goto findRoot
:foundRoot

set "WRAPPER_LAUNCHER=org.apache.maven.wrapper.MavenWrapperMain"

@REM Download wrapper jar if it does not exist
if exist "%WRAPPER_JAR%" goto boot
echo Downloading Maven Wrapper JAR...
powershell -Command "&{ [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; (New-Object Net.WebClient).DownloadFile('https://repo.maven.apache.org/maven2/org/apache/maven/wrapper/maven-wrapper/3.2.0/maven-wrapper-3.2.0.jar', '%WRAPPER_JAR%') }"
if not exist "%WRAPPER_JAR%" (
    echo Error: Could not download maven-wrapper.jar
    exit /b 1
)

:boot
@REM Find Java
if not "%JAVA_HOME%"=="" set "JAVA_EXE=%JAVA_HOME%\bin\java.exe"
if "%JAVA_EXE%"=="" set JAVA_EXE=java

@REM Run Maven
set "MAVEN_PROJECT_ROOT=%MAVEN_PROJECT_ROOT:~0,-1%"
"%JAVA_EXE%" %MAVEN_OPTS% -classpath "%WRAPPER_JAR%" "-Dmaven.multiModuleProjectDirectory=%MAVEN_PROJECT_ROOT%" %WRAPPER_LAUNCHER% %*

if ERRORLEVEL 1 set ERROR_CODE=1

@setlocal & exit /B %ERROR_CODE%
